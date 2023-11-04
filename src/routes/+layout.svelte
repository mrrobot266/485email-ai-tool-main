<script>
	import '../app.css'
	import Header from '../components/header.svelte';
</script>

<div class="bg-primary text-white min-h-screen">
	<Header />
	<slot />
</div>
