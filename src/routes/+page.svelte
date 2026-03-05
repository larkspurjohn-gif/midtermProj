<script>
	import { onDestroy, onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	let articles = [];
	let analytics = [];
	let loading = false;
	let error = '';

	let businessName = '';
	let businessType = '';
	let businessRating = '';
	let editingId = null;
	let chartCanvas;
	let chart;

	const ARTICLES_ENDPOINT = '/api/articles';
    const categories = ["Beauty", "Restaurant", "Health", "Retail", "Home", "Other"];
    
	const renderChart = () => {
	if (!chartCanvas || articles.length === 0) return;

	// 1️⃣ Create rating buckets 0–10
	const ratingCounts = Array(11).fill(0);

	articles.forEach(article => {
		const rating = Number(article.businessRating);
		if (!isNaN(rating) && rating >= 0 && rating <= 10) {
			ratingCounts[rating]++;
		}
	});

	// 2️⃣ Labels = 0 through 10
	const labels = ratingCounts.map((_, index) => index.toString());

	const dataset = [
		{
			label: 'Number of Businesses',
			data: ratingCounts,
			borderRadius: 4
		}
	];

	// 3️⃣ Create or update chart
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
						text: 'Rating Distribution (0–10)'
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Rating'
						}
					},
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1,
							precision: 0
						},
						title: {
							display: true,
							text: 'Count'
						}
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
		businessRating = '';
		editingId = null;
	};

	const submitForm = async () => {
		error = '';
		const payload = {
			businessName: businessName.trim(),
			businessType: businessType.trim(),
			businessRating: Number(businessRating)
		};

		if (!payload.businessName || !payload.businessType || !payload.businessRating) {
			error = 'Please enter article name, article Category , and article Date.';
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
        
        // FIX: Remove the Date logic, just use the number
        businessRating = article.businessRating; 
        
        editingId = article._id;
    };

	const deleteArticle = async (id) => {
		if (!id) {
			console.error('DELETE CALLED WITH INVALID ID:', id);
			error = 'Invalid article ID';
			return;
		}

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
						type="number"
	                    min="0"
	                    max="10"
	                    step="1"
	                    placeholder="Rating (0-10)"
						required
						bind:value={businessRating}
					/>
				</div>
				<div class="mt-3 flex gap-2">
					<button
						type="submit"
						class="rounded cursor-pointer bg-slate-900 px-4 py-2 text-sm text-white"
					>
						{editingId ? 'Update' : 'Create'}
					</button>
					{#if editingId}
						<button
							type="button"
							class="rounded cursor-pointer border px-4 py-2 text-sm"
							on:click={resetForm}
						>
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
								<p class="text-sm font-medium">{article.businessName} {article.businessType}</p>
								<p class="text-xs text-slate-500">Dates: {article.businessRating}</p>
							</div>
							<div class="flex gap-2">
								<button
									class="rounded cursor-pointer border px-3 py-1 text-xs"
									on:click={() => editArticle(article)}
								>
									Edit
								</button>
								<button
									class="rounded cursor-pointer border px-3 py-1 text-xs text-red-600"
									on:click={() => deleteArticle(article._id)}
								>
									Delete
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

    <h1 class="text-2xl font-semibold pt-6">Data Visualization</h1>
		<div class="mt-6 rounded-lg border bg-white p-4">
			<h2 class="text-sm font-medium text-slate-700">Rating chart</h2>
			<div class="mt-3 h-64">
				<canvas bind:this={chartCanvas}></canvas>
			</div>
		</div>
	</div>
</div>
