<script>
    export let label =""
    export let id=""
</script>

<div class="flex flex-col mb-6">
    <label class="mb-2 text-md" for={id}>{label}</label>
    <slot />
</div>