<script lang="ts">
import Icons from "./../../Icons.svelte";
export let icon: any = null;
export let text: string = null;
</script>

{#if text}
  <span
    class="flex flex-col self-center justify-center h-full text-dark-lightest"
    >{text}</span>
{:else if icon}
  <Icons icon="{icon}" />
{/if}
