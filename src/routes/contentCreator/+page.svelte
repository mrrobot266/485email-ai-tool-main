<script lang="ts">
    import type { CreateCompletionResponse } from 'openai';
    import { SSE } from 'sse.js';
    import FieldWrapper from "../../components/field-wrapper.svelte";
    import Login from './login.svelte'; // Ensure the correct path
    import History from './history.svelte';
    import ContentView from './contentView.svelte';

    let context = '';
    let requirement = '';
    let writingExample = '';

    let loading = false;
    let error = false;
    let answer = '';
    let copyDisabled = true;

    // let selectedContent = null;
    let showLogin = false; // Add this to track if the login modal should be shown
    let showHistory = false;

    const handleSubmit = async () => {
        // ... handleSubmit logic remains unchanged
    };

    const copyToClipboard = () => {
        // ... copyToClipboard logic remains unchanged
    };
</script>

<header>
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

<div class="max-w-md w-full m-auto flex flex-col items-center p-12">
    <h1 class="text-3xl font-semibold">Write Me an Article</h1>
    <h2 class="text-sm text-dull my-6">Please fill out the details</h2>
    <form on:submit|preventDefault={handleSubmit} class="w-full p-4">
        <FieldWrapper label="What is the article about?">
            <textarea class="form-field w-full h-20" name="requirement" bind:value={requirement} placeholder="Describe the article topic here"></textarea>
        </FieldWrapper>
        
        <FieldWrapper label="Provide sample articles below so your writing style and tone can be replicated.">
            <textarea class="form-field w-full h-52" id="email-textarea" name="writingExample" bind:value={writingExample}></textarea>
        </FieldWrapper>
        <button class="bg-secondary w-full p-4 rounded-md my-2">Write Article</button>
    </form>

    {#if answer}
        <div class="my-8 border-[0] border-b border-line"></div>
        <FieldWrapper label="Generated Article:">
            <div class="form-field" innerHTML={answer}></div>
        </FieldWrapper>
        <button on:click|preventDefault={copyToClipboard} class="bg-secondary w-full p-4 rounded-md my-2" disabled={copyDisabled}>Copy</button>
    {/if}
</div>

<footer>
    <!-- Footer content remains unchanged -->
</footer>
