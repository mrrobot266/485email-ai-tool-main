<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let username = '';
    let password = '';

    const handleLogin = () => {
        // Handle your login logic here
        // Likely involves sending username and password to your backend
    };

    const closeLogin = () => {
        isPopupVisible = false;
        dispatch('close');
    };

    let isPopupVisible = true; // This variable will handle the visibility of the popup

    const closePopup = () => {
        isPopupVisible = false;
    };
</script>



<style>
    div.modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 100;
    }

    div.overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        z-index: 50;
    }

    .close-btn {
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: transparent;
        border: none; /* Adding a border */
        color: gray; /* Change the button text color */
        cursor: pointer;
        font-size: 20px;
        front-weight: bold;
        /* //border-radius: 50%; Makes it round */
        width: 24px;
        height: 24px;
        line-height: 20px; /* Center the 'X' vertically */
        text-align: center; /* Center the 'X' horizontally */
    }
    .close-btn:hover {
        /* //background-color: gray; */
        color: darkgray;
    }

    input {
        padding: 8px 12px;
        border: 2px solid gray; /* Gray outline */
        border-radius: 4px; /* Optional: to have rounded corners */
    }

    input:focus {
        outline: none;
        border-color: darkgray; /* Darker border when the input is focused */
    }
</style>

{#if isPopupVisible}
<div class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10"></div>
<div class="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg flex flex-col justify-between z-20">
    <button on:click={closeLogin} class="close-btn">x</button>
        <h2 class="text-3xl font-medium pb-1">Login</h2>
        <form on:submit|preventDefault={handleLogin}>
            <label for="username" class="pb-2 text-lg">Username:</label>
            <input type="text" bind:value={username} class="rounded-md p-2 text-zinc-900 border border-gray-300 w-full mb-4 focus:border-gray-500" />

            <label for="password" class="pb-2 text-lg">Password:</label>
            <input type="password" bind:value={password} class="rounded-md p-2 text-zinc-900 border border-gray-300 w-full mb-4 focus:border-gray-500" />
    <button type="submit" on:click={handleLogin} class="px-5 py-3 font-medium text-lg bg-blue-700 text-white rounded-md mt-4 hover:bg-blue-800 transition-all duration-200 ease-in-out">Login</button>
  </form>
</div>
{/if}
