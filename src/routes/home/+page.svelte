<script>
    import { onMount } from 'svelte';

    let articles = [];
    let loading = true;
    let searchTerm = "";
    let selectedCategory = "All";
    
    // Summary Stats - Updated to count Businesses
    $: totalBusinesses = articles.length;
    
    // Filtered List - Updated to check Name and Description
   $: filteredArticles = articles.filter(item => {
        const matchesSearch = 
            item.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.businessDescription && item.businessDescription.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === "All" || item.businessType === selectedCategory;
        
        return matchesSearch && matchesCategory;
    }).reverse(); // Keep newest at the top

    // Sync categories with the Admin Portal options
    const staticCategories = ["Beauty", "Restaurant", "Health", "Retail", "Home", "Other"];
    $: categories = ["All", ...staticCategories];

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
    <header class="py-16 text-center text-black">
        <div class="mx-auto max-w-4xl px-4">
            <h1 class="text-6xl font-semibold tracking-tight">Explore Durham</h1>
            <p class="mt-4 text-lg text-slate-600">
                Community-driven insights for local favorites.
            </p>
            
            <div class="mt-8 flex justify-center">
                <div class="relative w-full max-w-lg">
                    <input 
                        type="text" 
                        bind:value={searchTerm}
                        placeholder="Search name or description..." 
                        class="w-full rounded-full border border-slate-200 py-4 pl-6 pr-12 text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                        {filteredArticles.length} businesses
                    </span>
                </div>
            </div>
            
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {#each categories as category}
                    <button 
                        on:click={() => selectedCategory = category}
                        class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all 
                        {selectedCategory === category ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}"
                    >
                        {category}
                    </button>
                {/each}
            </div>
        </div>

        {#if loading}
            <div class="flex justify-center py-20">
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        {:else if filteredArticles.length === 0}
            <div class="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <p class="text-slate-500 italic">No businesses match your search.</p>
            </div>
        {:else}
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each filteredArticles as business}
                    <div class="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg">
                        <div class="p-6 flex-grow">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {business.businessType}
                                </span>
                                <div class="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                    💬 {business.feedback?.length || 0}
                                </div>
                            </div>
                            
                            <h3 class="text-xl font-bold text-slate-900">{business.businessName}</h3>
                            
                            <p class="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                {business.businessDescription || "No description available."}
                            </p>
                        </div>
                        
                        <div class="p-6 pt-0">
                            <a 
                                href="/directory/{business._id}" 
                                class="block text-center w-full rounded-xl py-3 text-sm font-bold text-white bg-slate-900 transition-all hover:bg-blue-700 shadow-sm"
                            >
                                View Glows & Grows
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </main>
</div>

<style>
    /* Hides scrollbar for category filter on mobile */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>