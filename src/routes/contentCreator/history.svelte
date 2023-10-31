<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let visible = false;  // accept the prop from parent
    export let onClose = () => {};  // accept the close function from parent

    let selectedContent = ' ';
    let isViewingHistory = true;
    let historyItems = [
        'Generated content example 1...',
        'Generated content example 2...',
        'Generated content example 3...',
        // Add more history items as needed
    ];

    let popupHeight = `${historyItems.length * 50}px`; 
    const viewContent = (/** @type {string} */ content) => {
        selectedContent = content;
        console.log(selectedContent);
    };
    const returnToHistory = () => {
        isViewingHistory = true;
    }
    const closeHistoryPopup = () => {
        onClose();  // use the function passed from the parent to close the popup
        dispatch('close');  // this will notify any parent component if needed
    };
</script>

<!-- Your content before the button -->



{#if visible}
<div class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10"></div>
<div class="modal" style="--popupHeight: {popupHeight}">
    <button on:click={closeHistoryPopup} class="close-btn">x</button>
    {#if isViewingHistory}
        <h2 class="text-3xl font-medium pb-1">History</h2>
        <div class="history-list">
            {#each historyItems as item}
                <button on:click={() => viewContent(item)} class="history-item">{item}</button>
            {/each}
        </div>
    {:else}
        <button on:click={returnToHistory} class="history-item">Back</button>
        <div class="content">{selectedContent}</div>
    {/if}
</div>
{/if}

<style>
    /* Add the same styles for overlay, modal, and close-btn from your login.svelte */
    .modal {
        display: flex;
        flex-direction: column;
        min-height: 150px;  /* set a minimum height */
        max-height: 80vh;   /* 80% of viewport height, adjust as needed */
        overflow-y: auto;   /* will show scroll if content is longer than max-height */
        align-items: center;
        justify-content: center;
        /* ... add other modal styles here ... */
    }
    .history-list {
        list-style: none;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px; /* spacing between buttons */
    }

    .history-item {
        height: 50px;
    }

    .content {
        font-size: 1rem;
    }

    .close-btn {
        background-color: #f0f0f0;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 10px;
        right: 10px;
    }
</style>
