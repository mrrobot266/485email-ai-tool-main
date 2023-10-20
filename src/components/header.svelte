<script>
    import { page } from '$app/stores';  

    const links = [
        {
            label: "Home Page",
            link: "/home"
        },
        {
            label: "Email Writing Tool",
            link: "/"
        },
        {
            label: "Save Voice Style",
            link: "/saveVoice"
        },
        {
            label: "About Page",
            link: "/about"
        }
    ]

    $: currentRoute = $page.url.pathname 
     

</script>

  
<div class="flex justify-between items-center px-8 py-4 w-full border-[0] border-b border-line">
    <div><img src="/logo.png" alt="logo" /></div>
    <div class="flex">
        {#each links as item}
            <a href={item.link} class={`mx-4 ${(currentRoute === item.link) && 'text-secondary'}`}>{item.label}</a>
        {/each}
    </div>
    <div>
        <!-- <button class="border border-secondary rounded-md px-4 py-2 text-secondary">
            Contact Us
        </button> -->
    </div>
</div>
