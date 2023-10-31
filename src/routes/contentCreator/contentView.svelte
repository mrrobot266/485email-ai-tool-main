<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

   // export let content;

    const closeContentView = () => {
        dispatch('closecontent');  
    };
</script>

<div class="content-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg flex flex-col justify-between z-20 w-4/5 h-4/5 overflow-y-scroll">
    <button on:click={closeContentView} class="close-btn">Back to History</button>
    <div>
        <!-- {content} -->
    </div>
</div>
