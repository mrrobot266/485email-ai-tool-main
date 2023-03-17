<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
	import { SSE } from 'sse.js'

	let context = ''
	let recipientName = ''
	let yourName = ''
	let emailContext = ''
	let writingExample = ''

	let loading = false
	let error = false
	let answer = ''

	const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		context = "Write an email to " + recipientName + ", from " + yourName + " and " + emailContext + 
		"Write it in my writing style and tone but do not reiterate words from the text below because it is completely unrelated, only use it as a reference: "  
		+ writingExample;

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
</script>

<h1>Write Emails In My Writing Style</h1>
<form on:submit|preventDefault={() => handleSubmit()}>
	<div style="display: flex; align-items: center; margin-bottom: 10px;">
		<label for="recipientName" style="margin-right: 10px;">Recipient Name</label>
		<textarea name="recipientName" rows="1" style="flex: 1;" bind:value={recipientName}></textarea>
	</div>

	<div style="display: flex; align-items: center; margin-bottom: 20px;">
		<label for="yourName" style="margin-right: 10px;">Your Name</label>
		<textarea name="yourName" rows="1" style="flex: 1;" bind:value={yourName}></textarea>
	</div>
	  
	<label for="emailContext" style="margin-right: 10px;">What is the email about?</label>
	<textarea name="emailContext" rows="2" style="flex: 1;" bind:value={emailContext}></textarea>
	
	<label for="writingExample" style="margin-right: 10px;">Provide sample emails below so your writing style and tone can be replicated.</label>
	<!--
	<div style="display: flex; flex-direction: row; align-items: center;">
		-->
		<textarea id="email-textarea" name="writingExample" rows="5" bind:value={writingExample} style="width: 100%;"></textarea>
		<!--
		<button id="load-button" type="button" style="font-size: 16px; padding: 1px 1px;">Erick's Style</button>
	</div>

	<script>
		const button2 = document.getElementById('load-button');
		const textarea = document.getElementById('email-textarea');
  
		button2.addEventListener('click', async () => {
		  try {
			const response = await fetch('Erick-email-samples.txt');
			const text = await response.text();
			textarea.value = text;
		  } catch (error) {
			console.error(error);
		  }
		});
	</script>
-->
	<button>Write Email</button>
	<div class="pt-4">
		<h2>Generated Email:</h2>
		{#if answer}
			<textarea rows="20" bind:value={answer} style="width: 100%;"></textarea>
		{/if}
	</div>

</form>
