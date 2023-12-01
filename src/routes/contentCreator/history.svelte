<script>
    import { createEventDispatcher } from 'svelte';
    import { historyItems } from '../../historyStore';
    const dispatch = createEventDispatcher();

    export let visible;  // accept the prop from parent
    export let onClose;  // accept the close function from parent

    let selectedContent = ' ';
    let isViewingHistory = true;
    let isViewingContent = false;
    let popupHeight = `${historyItems.length * 50}px`; 
    $: items = $historyItems;

    const viewContent = item => {
        selectedContent = item.content;
        isViewingHistory = false;
        isViewingContent = true; // Set true when content is being viewed
    };

    const returnToHistory = () => {
        isViewingHistory = true;
        isViewingContent = false; // Set false to go back to history
    };

    $: if (!visible) {
        // If the `visible` prop is changed externally, reset local state
        isViewingHistory = true;
        isViewingContent = false;
        selectedContent = '';
    }

    function closeHistoryPopup() {
        visible = false;
        if (onClose) {
            onClose();
        }
        dispatch('close');
    };
    async function fetchHistory() {
        try {
            const querySnapshot = await getDocs(collection(db, "generatedArticles"));
            const items = querySnapshot.docs.map(doc => {
                let data = doc.data();
                return {
                    id: doc.id,
                    keywords: data.keywords,
                    content: data.sections.join(' '), // Join the sections into a single string
                    timestamp: data.timestamp.toDate().toLocaleString() // Format timestamp
                };
            });
            historyItems.set(items); // Correct way to set the store's value
        } catch (error) {
            console.error("Error fetching history: ", error);
        }
    }
</script>

<!-- Your content before the button -->



{#if visible}
    <div class="overlay" on:click={closeHistoryPopup}></div>
    <div class="modal">
        <button on:click={closeHistoryPopup} class="close-btn">x</button>
        {#if isViewingHistory}
            <h2>History</h2>
            <div class="history-list">
                {#each $historyItems as item}
                    <button on:click={() => viewContent(item)} class="history-item">
                        {item.keywords} - {item.timestamp}
                    </button>
                {/each}
            </div>
        {:else if isViewingContent}
            <!-- Content view with a back button -->
            <button on:click={returnToHistory} class="back-button">Back</button>
            <div class="content-view">
                {@html selectedContent}
            </div>
        {/if}
    </div>
{/if}

<style>
    /* Add the same styles for overlay, modal, and close-btn from your login.svelte */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000; /* Ensure this is high enough to cover the page content */
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: black;
        padding: 20px;
        z-index: 1001; /* Ensure this is higher than the overlay */
        max-height: 80vh; /* or any other value that suits your design */
        overflow-y: auto; /* Enable vertical scrolling */
        /* Rest of your modal styles */
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
    .content-view {
    padding: 1rem; /* Add padding for content readability */
    }

    .close-btn {
        background-color: #3b3939;
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
