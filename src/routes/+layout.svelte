<script>
	import '../app.css'
	import Header from '../components/header.svelte';
</script>

<div class="bg-primary h-screen text-white">
	<Header />
	<slot />
</div>
