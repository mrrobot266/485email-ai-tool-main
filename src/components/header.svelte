<script>
    import { page } from '$app/stores';  

    const links = [
        {
            label: "Home Page",
            link: "/",
            children: ["/"]
        },
        {
            label: "Email Writing Tool",
            link: "/email-writing",
            children: ["/email-writing"]
        },
        {
            label: "Save Voice Style",
            link: "/save-voice",
            children: ['/save-voice', '/save-voice/newPersona']
        },
        {
            label: "Content Creator",
            link: "/contentCreator",
            children: ['/content-creator']
        },
        {
            label: "About Page",
            link: "/about",
            children: ['/about']
        }
    ]

    $: currentRoute = $page.url.pathname 
     

</script>

  
<div class="flex justify-center items-center px-8 py-8 w-full border-[0] border-b border-line">
    <div class="absolute left-16"><img src="/logo.png" alt="logo" /></div>
    <div class="flex">
        {#each links as item}
            <a href={item.link} class={`mx-4 ${(item.children.includes(currentRoute)) && 'text-secondary'}`}>{item.label}</a>
        {/each}
    </div>
    <a class="absolute right-16" href="https://touchpointdigitalmarketing.com/" target="_blank">
        <button class="border border-secondary rounded-md px-4 py-2 text-secondary">
            Visit Main Website
        </button>
    </a>
</div>
