<script>
	import { replaceContentToShowClickableLinks } from '$lib/helpers.js';
	import { baseURLScan } from '../../constants.ts';
	import { createEventDispatcher } from 'svelte';

	export let message = '';
	export let smartContractAddress;

	const dispatch = createEventDispatcher();
</script>

You can observe your interactions with the

<a href="{baseURLScan}token/{smartContractAddress}#code" target="_blank">Smart Contract</a>
on zkevm.polygonscan.com
<a href="{baseURLScan}token/{smartContractAddress}" target="_blank">here</a>.
<p><br /></p>
{#if message != ''}
	{@html replaceContentToShowClickableLinks(message)}
	<p><br /></p>
{/if}
Reload the page to check for updates.
<p><br /></p>
<button class="button inside" on:click={() => dispatch('clickedOK')}>O.K.</button>
<p><br /></p>

<style>
</style>
