<script>
    import { onDestroy, onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    let articles = [];
    let loading = false;
    let error = '';

    let businessName = '';
    let businessType = '';
    let businessDescription = ''; // Changed from businessRating
    let editingId = null;
    let chartCanvas;
    let chart;

    const ARTICLES_ENDPOINT = '/api/articles';
    const categories = ["Beauty", "Restaurant", "Health", "Retail", "Home", "Other"];
	const categoryColors = {
        "Beauty": "#f472b6",      // Pink
        "Restaurant": "#fb923c",  // Orange
        "Health": "#4ade80",      // Green
        "Retail": "#60a5fa",      // Blue
        "Home": "#a78bfa",        // Purple
        "Other": "#94a3b8"        // Slate
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
        
        // Create an array of colors corresponding to the categories
        const backgroundColors = categories.map(cat => categoryColors[cat]);

        const dataset = [
            {
                label: 'Number of Businesses',
                data: dataValues,
                backgroundColor: backgroundColors, // Now an array of colors
                borderColor: backgroundColors.map(color => color), // Optional: matching borders
                borderWidth: 1,
                borderRadius: 4
            }
        ];

        if (!chart) {
            chart = new Chart(chartCanvas, {
                type: 'bar',
                data: {
                    labels,
                    datasets: dataset
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Business Type Distribution'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, precision: 0 },
                            title: { display: true, text: 'Count' }
                        }
                    }
                }
            });
            return;
        }

        chart.data.labels = labels;
        chart.data.datasets = dataset;
        chart.update();
    };

    const loadArticles = async () => {
        loading = true;
        error = '';
        try {
            const res = await fetch(ARTICLES_ENDPOINT);
            if (!res.ok) throw new Error('Failed to load articles');
            articles = await res.json();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        } finally {
            loading = false;
        }
    };

    const resetForm = () => {
        businessName = '';
        businessType = '';
        businessDescription = ''; // Updated
        editingId = null;
    };

    const submitForm = async () => {
        error = '';
        const payload = {
            businessName: businessName.trim(),
            businessType: businessType.trim(),
            businessDescription: businessDescription.trim() // Updated
        };

        if (!payload.businessName || !payload.businessType || !payload.businessDescription) {
            error = 'Please fill out all fields.';
            return;
        }

        try {
            const res = await fetch(editingId ? `${ARTICLES_ENDPOINT}/${editingId}` : ARTICLES_ENDPOINT, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Save failed');
            await loadArticles();
            renderChart();
            resetForm();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        }
    };

    const editArticle = (article) => {
        if (!article._id) return;
        businessName = article.businessName;
        businessType = article.businessType;
        businessDescription = article.businessDescription; // Updated
        editingId = article._id;
    };

    const deleteArticle = async (id) => {
        try {
            const res = await fetch(`${ARTICLES_ENDPOINT}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            await loadArticles();
            renderChart();
        } catch (err) {
            error = err?.message ?? 'Something went wrong';
        }
    };

    onMount(async() => {
        await loadArticles();
        renderChart();
    });

    onDestroy(() => {
        chart?.destroy();
        chart = null;
    });
</script>

<div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto max-w-3xl px-4 py-10">
        <h1 class="text-2xl font-semibold">Admin Portal</h1>
        <p class="mt-1 text-sm text-slate-600">CRUD for Durham Businesses</p>

        <div class="mt-6 rounded-lg border bg-white p-4">
            <h2 class="text-sm font-medium text-slate-700">{editingId ? 'Edit business' : 'Add business'}</h2>
            <form class="mt-3" on:submit|preventDefault={submitForm}>
                <div class="grid gap-3 sm:grid-cols-3">
                    <input
                        class="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Business name"
                        required
                        bind:value={businessName}
                    />
                    <select
                        class="w-full rounded border px-3 py-2 text-sm bg-white"
                        required
                        bind:value={businessType}
                    >
                        <option value="" disabled selected>Select Business Type</option>
                        {#each categories as category}
                            <option value={category}>{category}</option>
                        {/each}
                    </select>
                    <input
                        class="w-full rounded border px-3 py-2 text-sm"
                        placeholder="Business Description"
                        required
                        bind:value={businessDescription}
                    />
                </div>
                <div class="mt-3 flex gap-2">
                    <button type="submit" class="rounded cursor-pointer bg-slate-900 px-4 py-2 text-sm text-white">
                        {editingId ? 'Update' : 'Create'}
                    </button>
                    {#if editingId}
                        <button type="button" class="rounded cursor-pointer border px-4 py-2 text-sm" on:click={resetForm}>
                            Cancel
                        </button>
                    {/if}
                </div>
                {#if error}
                    <p class="mt-3 text-sm text-red-600">{error}</p>
                {/if}
            </form>
        </div>

        <div class="mt-6 rounded-lg border bg-white">
            <div class="flex items-center justify-between border-b px-4 py-3">
                <h2 class="text-sm font-medium text-slate-700">Businesses</h2>
                <button class="cursor-pointer text-sm text-slate-600" on:click={loadArticles}>Refresh</button>
            </div>
            {#if loading}
                <p class="px-4 py-6 text-sm text-slate-500">Loading...</p>
            {:else if articles.length === 0}
                <p class="px-4 py-6 text-sm text-slate-500">No businesses yet.</p>
            {:else}
                <ul class="divide-y">
                    {#each articles as article}
                        <li class="flex items-center justify-between px-4 py-3">
                            <div>
                                <p class="text-sm font-medium">{article.businessName} — <span class="text-slate-500 font-normal">{article.businessType}</span></p>
                                <p class="text-xs text-slate-500 truncate max-w-xs">{article.businessDescription}</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="rounded cursor-pointer border px-3 py-1 text-xs" on:click={() => editArticle(article)}>Edit</button>
                                <button class="rounded cursor-pointer border px-3 py-1 text-xs text-red-600" on:click={() => deleteArticle(article._id)}>Delete</button>
                            </div>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <h1 class="text-2xl font-semibold pt-6">Data Visualization</h1>
        <div class="mt-6 rounded-lg border bg-white p-4">
            <h2 class="text-sm font-medium text-slate-700">Business Type Distribution</h2>
            <div class="mt-3 h-64">
                <canvas bind:this={chartCanvas}></canvas>
            </div>
        </div>
    </div>
</div>