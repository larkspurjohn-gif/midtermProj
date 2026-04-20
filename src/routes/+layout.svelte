<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<nav>
  <a href="/">Admin</a>
  <a href="/home">Home</a>
</nav>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<style>
    nav {
        display: flex;
        justify-content: flex-start;
		gap: 40px;
        align-items: center; /* This centers them vertically in the 60px height */
        
        width: 100%;
        box-sizing: border-box; /* IMPORTANT: Prevents padding from pushing the nav off-screen */
        
        padding: 0 40px; /* Adjust this to control the gap from the edges */
        background-color: #333;
        height: 60px;
    }

    nav a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }
</style>
