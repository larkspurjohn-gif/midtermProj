<script>
    import { onDestroy, onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    let articles = [];
    let loading = false;
    let error = '';

    // Form Fields
    let businessName = '';
    let businessType = '';
    let businessDescription = '';
    let businessOwner = '';
    let editingId = null;

    // Multi-day Hours Config
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Initialize hoursConfig with default 9-5 values
    let hoursConfig = days.reduce((acc, day) => {
        acc[day] = { open: '09:00', close: '17:00', closed: false };
        return acc;
    }, {});

    let chartCanvas;
    let chart;

    const ARTICLES_ENDPOINT = '/api/articles';
    const categories = ["Beauty", "Restaurant", "Health", "Retail", "Home", "Other"];
    const categoryColors = {
        "Beauty": "#f472b6", "Restaurant": "#fb923c", "Health": "#4ade80",
        "Retail": "#60a5fa", "Home": "#a78bfa", "Other": "#94a3b8"
    }
    
    const renderChart = () => {
        if (!chartCanvas || articles.length === 0) return;
        const typeCounts = {};
        categories.forEach(cat => typeCounts[cat] = 0);
        articles.forEach(article => {
            if (typeCounts.hasOwnProperty(article.businessType)) {
                typeCounts[article.businessType]++;
            } else {
                typeCounts["Other"]++;
            }
        });

        const labels = categories;
        const dataValues = categories.map(cat => typeCounts[cat]);
        const backgroundColors = categories.map(cat => categoryColors[cat]);

        if (chart) chart.destroy();
        chart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Number of Businesses',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    };

    const loadArticles = async () => {
        loading = true;
        try {
            const res = await fetch(ARTICLES_ENDPOINT);
            if (!res.ok) throw new Error('Failed to load articles');
            articles = await res.json();
            renderChart();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        } finally {
            loading = false;
        }
    };

    const resetForm = () => {
        businessName = '';
        businessType = '';
        businessDescription = '';
        businessOwner = '';
        editingId = null;
        // Reset hours to defaults
        hoursConfig = days.reduce((acc, day) => {
            acc[day] = { open: '09:00', close: '17:00', closed: false };
            return acc;
        }, {});
    };

    const submitForm = async () => {
        error = '';
        
        // Transform hoursConfig into the schema format (arrays)
        const formattedHours = {};
        days.forEach(day => {
            formattedHours[day] = hoursConfig[day].closed 
                ? [] 
                : [{ open: hoursConfig[day].open, close: hoursConfig[day].close }];
        });

        const payload = {
            businessName: businessName.trim(),
            businessType: businessType.trim(),
            businessDescription: businessDescription.trim(),
            businessOwner: businessOwner.trim(),
            businessHours: formattedHours
        };

        try {
            const res = await fetch(editingId ? `${ARTICLES_ENDPOINT}/${editingId}` : ARTICLES_ENDPOINT, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Save failed');
            await loadArticles();
            resetForm();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        }
    };

    const editArticle = (article) => {
        editingId = article._id;
        businessName = article.businessName;
        businessType = article.businessType;
        businessDescription = article.businessDescription;
        businessOwner = article.businessOwner || '';

        // Load hours back into config
        days.forEach(day => {
            const slot = article.businessHours?.[day]?.[0];
            if (slot) {
                hoursConfig[day] = { open: slot.open, close: slot.close, closed: false };
            } else {
                hoursConfig[day] = { open: '09:00', close: '17:00', closed: true };
            }
        });
    };

    const deleteArticle = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${ARTICLES_ENDPOINT}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            await loadArticles();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        }
    };

    onMount(loadArticles);
    onDestroy(() => chart?.destroy());
</script>

<div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto max-w-3xl px-4 py-10">
        <h1 class="text-2xl font-semibold">Admin Portal</h1>
        <p class="mt-1 text-sm text-slate-600">CRUD for Durham Businesses</p>

        <div class="mt-6 rounded-lg border bg-white p-4">
            <h2 class="text-sm font-medium text-slate-700">{editingId ? 'Edit business' : 'Add business'}</h2>
            <form class="mt-3" on:submit|preventDefault={submitForm}>
                <div class="grid gap-3 sm:grid-cols-2">
                    <input class="w-full rounded border px-3 py-2 text-sm" placeholder="Business name" required bind:value={businessName} />
                    <select class="w-full rounded border px-3 py-2 text-sm bg-white" required bind:value={businessType}>
                        <option value="" disabled selected>Select Category</option>
                        {#each categories as category}
                            <option value={category}>{category}</option>
                        {/each}
                    </select>
                    <input class="w-full rounded border px-3 py-2 text-sm" placeholder="Owner Name" required bind:value={businessOwner} />
                    <input class="w-full rounded border px-3 py-2 text-sm" placeholder="Business Description" required bind:value={businessDescription} />
                </div>

                <div class="mt-4 border-t pt-4">
                    <h3 class="text-xs font-bold text-slate-500 uppercase mb-3">Weekly Schedule</h3>
                    <div class="grid gap-2">
                        {#each days as day}
                            <div class="flex items-center justify-between bg-slate-50 p-2 rounded border">
                                <span class="text-xs font-semibold w-20 capitalize">{day}</span>
                                <div class="flex items-center gap-4">
                                    <label class="flex items-center gap-1 cursor-pointer">
                                        <input type="checkbox" bind:checked={hoursConfig[day].closed} />
                                        <span class="text-xs text-slate-500">Closed</span>
                                    </label>
                                    {#if !hoursConfig[day].closed}
                                        <div class="flex items-center gap-1">
                                            <input type="time" class="rounded border px-1 py-0.5 text-xs" bind:value={hoursConfig[day].open} />
                                            <span class="text-xs text-slate-400">to</span>
                                            <input type="time" class="rounded border px-1 py-0.5 text-xs" bind:value={hoursConfig[day].close} />
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="mt-4 flex gap-2">
                    <button type="submit" class="rounded bg-slate-900 px-4 py-2 text-sm text-white font-medium hover:bg-slate-800 transition-colors">
                        {editingId ? 'Update' : 'Create'}
                    </button>
                    {#if editingId}
                        <button type="button" class="rounded border px-4 py-2 text-sm" on:click={resetForm}>Cancel</button>
                    {/if}
                </div>
                {#if error} <p class="mt-3 text-sm text-red-600">{error}</p> {/if}
            </form>
        </div>

        <div class="mt-6 rounded-lg border bg-white">
            <div class="flex items-center justify-between border-b px-4 py-3">
                <h2 class="text-sm font-medium text-slate-700">Businesses</h2>
                <button class="text-sm text-slate-600 hover:text-slate-900 underline" on:click={loadArticles}>Refresh</button>
            </div>
            {#if loading}
                <p class="px-4 py-6 text-sm text-slate-500 text-center">Loading...</p>
            {:else if articles.length === 0}
                <p class="px-4 py-6 text-sm text-slate-500 text-center">No businesses yet.</p>
            {:else}
                <ul class="divide-y">
                    {#each articles as article}
                        <li class="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                            <div class="overflow-hidden mr-4">
                                <p class="text-sm font-medium truncate">{article.businessName} — <span class="text-slate-500 font-normal">{article.businessType}</span></p>
                                <p class="text-xs text-slate-400 italic">Owner: {article.businessOwner}</p>
                            </div>
                            <div class="flex gap-2 shrink-0">
                                <button class="rounded border px-3 py-1 text-xs hover:bg-white" on:click={() => editArticle(article)}>Edit</button>
                                <button class="rounded border px-3 py-1 text-xs text-red-600 hover:bg-red-50" on:click={() => deleteArticle(article._id)}>Delete</button>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <h1 class="text-2xl font-semibold pt-8">Analytics</h1>
        <div class="mt-4 rounded-lg border bg-white p-4 mb-10">
            <h2 class="text-sm font-medium text-slate-700 mb-4">Business Type Distribution</h2>
            <div class="h-64">
                <canvas bind:this={chartCanvas}></canvas>
            </div>
        </div>
    </div>
</div>