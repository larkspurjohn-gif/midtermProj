<script>
    export let data;
    // We use a local 'business' variable so we can update the UI immediately after POST
    $: business = data.business;

    let feedbackText = "";
    let feedbackType = "glow"; 
    let activeTab = "reviews"; 
    let feedbackFilter = "all";

    // Submit logic
    async function submitFeedback() {
        if (!feedbackText) return;
        const res = await fetch(`/api/articles/${business._id}`, {
            method: 'POST',
            body: JSON.stringify({ type: feedbackType, text: feedbackText }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            const updated = await res.json();
            business = updated; 
            feedbackText = ""; 
        }
    }

    // Reactive filtering for the list - using spread for immutability
    $: displayedFeedback = [...(business.feedback || [])].reverse().filter(item => {
        if (feedbackFilter === "all") return true;
        return item.type === feedbackFilter;
    });

    // Stats for the filters
    $: glowCount = (business.feedback || []).filter(f => f.type === 'glow').length;
    $: growCount = (business.feedback || []).filter(f => f.type === 'grow').length;

   // List of common words to ignore (Stop Words)
    const stopWords = new Set(['the', 'and', 'was', 'for', 'with', 'this', 'that', 'they', 'very', 'really', 'were', 'love', 'loved', 'horrible', 'rude', 'some', 'about']);

    function getTopPhrase(currentBusiness, type) {
        const feedback = (currentBusiness.feedback || []).filter(f => f.type === type);
        if (feedback.length === 0) return null;

        const counts = {};

        feedback.forEach(f => {
            const words = f.text.toLowerCase()
                .replace(/[.,!?;:]/g, "")
                .split(/\s+/)
                .filter(w => w.length > 2);
            
            for (let i = 0; i < words.length; i++) {
                if (!stopWords.has(words[i])) {
                    counts[words[i]] = (counts[words[i]] || 0) + 1;
                }
                if (i < words.length - 1) {
                    const phrase = `${words[i]} ${words[i+1]}`;
                    if (!stopWords.has(words[i]) && !stopWords.has(words[i+1])) {
                        counts[phrase] = (counts[phrase] || 0) + 1.5;
                    }
                }
            }
        });

        const result = Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b), [null, 0]);
        return result[0];
    }

    $: frequentGlow = getTopPhrase(business, 'glow');
    $: frequentGrow = getTopPhrase(business, 'grow');
</script>

<div class="max-w-4xl mx-auto p-8">
    <a href="/home" class="text-blue-600 hover:underline">← Back to Directory</a>
    
    <header class="mt-8">
        <span class="text-blue-500 font-bold uppercase tracking-widest text-sm">
            {business.businessType}
        </span>
        <h1 class="text-5xl font-bold mt-2">{business.businessName}</h1>
        <p class="mt-4 text-slate-500 max-w-2xl leading-relaxed">
            {business.businessDescription}
        </p>
    </header>

    <section class="mt-12 p-6 bg-white rounded-xl shadow-sm border">
        <h3 class="text-xl font-bold mb-4">Leave Feedback</h3>
        <div class="flex gap-4 mb-4">
            <button 
                on:click={() => feedbackType = 'glow'}
                class="px-4 py-2 rounded-full border transition-all {feedbackType === 'glow' ? 'bg-amber-100 border-amber-500 text-amber-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}">
                ✨ Glow
            </button>
            <button 
                on:click={() => feedbackType = 'grow'}
                class="px-4 py-2 rounded-full border transition-all {feedbackType === 'grow' ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}">
                🌱 Grow
            </button>
        </div>
        <textarea 
            bind:value={feedbackText}
            placeholder="What did they do well, or what could be better?"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
        ></textarea>
        <button 
            on:click={submitFeedback}
            class="mt-3 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
            Submit Feedback
        </button>
    </section>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-amber-50 border border-amber-200 p-5 rounded-2xl relative">
            <h4 class="text-amber-800 font-bold text-sm uppercase tracking-wider">Top Glow</h4>
            {#if frequentGlow}
                <div class="mt-2">
                    <span class="text-2xl font-black text-amber-600 capitalize leading-tight">{frequentGlow}</span>
                    <p class="text-slate-500 text-xs italic mt-1">Commonly praised by the community</p>
                </div>
            {:else}
                <p class="mt-2 text-amber-600/60 italic text-sm">No trends yet...</p>
            {/if}
        </div>

        <div class="bg-green-50 border border-green-200 p-5 rounded-2xl relative">
            <h4 class="text-green-800 font-bold text-sm uppercase tracking-wider">Top Grow</h4>
            {#if frequentGrow}
                <div class="mt-2">
                    <span class="text-2xl font-black text-green-700 capitalize leading-tight">{frequentGrow}</span>
                    <p class="text-slate-500 text-xs italic mt-1">Most suggested improvement</p>
                </div>
            {:else}
                <p class="mt-2 text-green-600/60 italic text-sm">No trends yet...</p>
            {/if}
        </div>
    </div>

    <div class="mt-12 flex border-b border-slate-200">
        <button 
            on:click={() => activeTab = 'reviews'}
            class="px-6 py-3 font-bold transition-all {activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}">
            Reviews ({business.feedback?.length || 0})
        </button>
        <button 
            on:click={() => activeTab = 'info'}
            class="px-6 py-3 font-bold transition-all {activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}">
            Business Info
        </button>
    </div>

    <div class="mt-8">
        {#if activeTab === 'reviews'}
            <div class="flex gap-2 mb-6">
                <button on:click={() => feedbackFilter = 'all'} 
                    class="px-4 py-1 rounded-md text-sm font-medium border {feedbackFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}">
                    All
                </button>
                <button on:click={() => feedbackFilter = 'glow'} 
                    class="px-4 py-1 rounded-md text-sm font-medium border {feedbackFilter === 'glow' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600'}">
                    ✨ Glows ({glowCount})
                </button>
                <button on:click={() => feedbackFilter = 'grow'} 
                    class="px-4 py-1 rounded-md text-sm font-medium border {feedbackFilter === 'grow' ? 'bg-green-600 text-white' : 'bg-white text-slate-600'}">
                    🌱 Grows ({growCount})
                </button>
            </div>

            <div class="grid gap-4 mb-20">
                {#each displayedFeedback as item}
                    <div class="p-5 rounded-xl border transition-all {item.type === 'glow' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}">
                        <div class="flex justify-between items-start">
                            <span class="font-bold uppercase text-xs tracking-wider {item.type === 'glow' ? 'text-amber-700' : 'text-green-700'}">
                                {item.type === 'glow' ? '✨ Glow' : '🌱 Grow'}
                            </span>
                        </div>
                        <p class="mt-2 text-slate-800">{item.text}</p>
                    </div>
                {:else}
                    <p class="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">No {feedbackFilter !== 'all' ? feedbackFilter : ''} feedback yet.</p>
                {/each}
            </div>
        {:else}
            <div class="bg-white p-8 rounded-xl border shadow-sm">
                <h3 class="text-lg font-bold mb-2">About this Business</h3>
                <p class="text-slate-600 leading-relaxed">
                    {business.businessDescription || "No description provided."}
                </p>
                <div class="mt-6 pt-6 border-t flex flex-wrap gap-4">
                    <div class="bg-slate-100 px-3 py-1 rounded text-sm text-slate-600">Category: {business.businessType}</div>
                    <div class="bg-slate-100 px-3 py-1 rounded text-sm text-slate-600">ID: {business._id}</div>
                </div>
            </div>
        {/if}
    </div>
</div>