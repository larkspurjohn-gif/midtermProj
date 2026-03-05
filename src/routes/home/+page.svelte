<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    let articles = [];
    let loading = true;
    let searchTerm = "";
    let selectedCategory = "All";
    let ratingFilter = 0;
    
    // Summary Stats
    $: totalBusinesses = articles.length;
    $: avgRating = articles.length 
        ? (articles.reduce((acc, curr) => acc + Number(curr.businessRating), 0) / articles.length).toFixed(1) 
        : 0;
    
    // Filtered List
   $: filteredArticles = articles.filter(item => {
        const matchesSearch = item.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.businessType === selectedCategory;
        
        // Handle the new "Under 5" logic
        let matchesRating = true;
        const rating = Number(item.businessRating);

        if (ratingFilter === "under5") {
            matchesRating = rating < 5;
        } else {
            matchesRating = rating >= Number(ratingFilter);
        }
        
        return matchesSearch && matchesCategory && matchesRating;
    });

    $: categories = ["All", ...new Set(articles.map(a => a.businessType))];

    const loadData = async () => {
        try {
            const res = await fetch('/api/articles');
            articles = await res.json();
        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            loading = false;
        }
    };

    onMount(loadData);
</script>

<div class="min-h-screen bg-slate-50 font-sans text-slate-900">
    <header class=" py-16 text-center text-black">
        <div class="mx-auto max-w-4xl px-4">
            <h1 class="text-6xl font-semibold ">Explore Durham</h1>
            <p class="mt-4 text-lg text-slate-600">
                Discover the best local businesses, from cozy cafes to high-tech hubs.
            </p>
            
            <div class="mt-8 flex justify-center">
                <div class="relative w-full max-w-lg">
                    <input 
                        type="text" 
                        bind:value={searchTerm}
                        placeholder="Search for a business..." 
                        class="w-full rounded-full border py-4 pl-6 pr-12 text-slate-900  focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="absolute right-4 top-4 text-slate-400">🔍</span>
                </div>
            </div>
        </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-12">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex items-baseline gap-3">
            <h2 class="text-2xl font-bold">Local Directory</h2>
            <span class="text-sm font-medium text-slate-400">
                {filteredArticles.length} results
            </span>
        </div>

        <select 
    bind:value={ratingFilter}
    class="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
>
    <option value="0">Any Rating</option>
    <option value="9">9+ Stars </option>
    <option value="8">8+ Stars </option>
    <option value="7">7+ Stars </option>
    <option value="5">5+ Stars </option>
    <option value="under5">Under 5 Stars</option>
</select>
    </div>
    
    <div class="flex gap-2 overflow-x-auto pb-2">
        {#each categories as category}
            <button 
                on:click={() => selectedCategory = category}
                class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors 
                {selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
            >
                {category}
            </button>
        {/each}
    </div>
</div>

    {#if loading}
        <div class="flex justify-center py-20">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        </div>
    {:else if filteredArticles.length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-2xl border border-dashed">
            <p class="text-slate-500">No businesses found matching your criteria.</p>
        </div>
    {:else}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each filteredArticles as business}
                <div class="group overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-md">
                    <div class="p-5">
                        <div class="flex justify-between items-start">
                            <div>
                                <span class="text-xs font-semibold uppercase tracking-wider text-blue-500">
                                    {business.businessType}
                                </span>
                                <h3 class="mt-1 text-xl font-semibold">{business.businessName}</h3>
                            </div>
                            <div class="flex items-center rounded-lg bg-amber-50 px-2 py-1 text-amber-700 font-bold border border-amber-100">
                                ★ {business.businessRating}
                            </div>
                        </div>
                        
                        <button class="mt-6 w-full rounded-lg bg-slate-50 py-2.5 text-sm font-semibold text-white bg-slate-900 transition-all">
                            View Details
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>

</div>

<style>
    /* Add any custom animations here if needed */
</style>