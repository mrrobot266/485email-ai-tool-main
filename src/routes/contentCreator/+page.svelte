<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
	import { SSE } from 'sse.js'
	import Login from './login.svelte'; // Ensure the correct path
	import History from './history.svelte';
	import ContentView from './contentView.svelte';

	let context = ''
	let requirement = ''
	let writingExample = ''

	let loading = false
	let error = false
	let answer = ''
	let copyDisabled = true;

	// let selectedContent = null;
    	let showLogin = false; // Add this to track if the login modal should be shown
	let showHistory = false;

	const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		context = "Write longest anticle about: " + requirement + 
		"Write it in my writing style and tone but do not reiterate words from the text below because it is completely unrelated, only use it as a reference: "  
		+ writingExample + "requirement of length of this article: longer the better";

		const eventSource = new SSE('/api/explain', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		})

		context = ''

		eventSource.addEventListener('error', (e) => {
			error = true
			loading = false
			alert('Something went wrong!')
		})

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false

				if (e.data === '[DONE]') {
					copyDisabled = false;
					return
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{ text }] = completionResponse.choices

				answer = (answer ?? '') + text
			} catch (err) {
				error = true
				loading = false
				console.error(err)
				alert('Something went wrong!')
			}
		})

		eventSource.stream()
	}
	const copyToClipboard = () => {
		const elem = document.createElement('textarea')
		elem.value = answer
		document.body.appendChild(elem)
		elem.select()
		document.execCommand('copy')
		document.body.removeChild(elem)
		alert('Copied to clipboard!')
 	}
</script>

<style>
    /* Add this style to your component */
    header h1 {
        background: linear-gradient(to right, blue, purple);
        -webkit-background-clip: text;
        color: transparent;
    }
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: white; /* To ensure text/content beneath doesn't show through */
        z-index: 10; /* Keep the header above all other content */
    }
    nav {
        display: flex;
        align-items: center; 
        justify-content: space-between;
    }
    button + button {
	margin-left: 10px;
    }
    .main-content {
        margin-top: 60px; /* Adjust as per your header's height */
    }
</style>

<header>
	<a href="https://touchpointdigitalmarketing.com/web-design/">
        	<span class = "title">touch point</span>
		<span class="subtitle">Digital Marketing Agency</span>
    	</a>
	<nav>
		<button on:click={() => showLogin = !showLogin}>Login</button>
		{#if showLogin}
		    <Login />
		{/if}

	        <button on:click={() => showHistory = true}>History</button>
	        {#if showHistory}
	            <History visible={showHistory} onClose={() => showHistory = false} />
	        {/if}
	</nav>
</header>

<div class="main-content">
	<h1>Welcome to Touch Point Digital Marketing Agency</h1>
	<h2>Unlocking Your Business' Potential by Maximizing the Power of the Internet.</h2>
	<form on:submit|preventDefault={() => handleSubmit()}>
		<label for="requirement">What is the article about?</label>
		<textarea name="requirement" rows="2" bind:value={requirement}></textarea>
	
		<label for="writingExample">Provide sample articles below so your writing style and tone can be replicated.</label>
		<textarea id="email-textarea" name="writingExample" rows="5" bind:value={writingExample}></textarea>
		<button>Write Article</button>
	</form>

	<div class="pt-4">
		<h2>Generated Article:</h2>
		{#if answer}
		<div>{@html answer}</div>
		{/if}
		{#if answer}
		  <button on:click|preventDefault={() => copyToClipboard()} disabled={copyDisabled}>Copy</button>
		{/if}
	</div>
<!-- 
	{#if selectedContent}
	    <ContentView content={selectedContent} on:closecontent={() => { selectedContent = null; showHistory = true; }} />
	{/if} -->
</div>

<footer>
	<!-- You can add footer content here -->
</footer>
