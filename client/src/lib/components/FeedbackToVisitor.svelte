<script>
	import { baseURLScan } from '../../constants.ts';
	import { createEventDispatcher } from 'svelte';

	export let message = '';
	export let smartContractAddress;

	const dispatch = createEventDispatcher();
</script>

<p><br /></p>
You can observe your interactions with the

<a href="{baseURLScan}token/{smartContractAddress}#code" target="_blank">Smart Contract</a>
on zkevm.polygonscan.com
<a href="{baseURLScan}token/{smartContractAddress}" target="_blank">here</a>.
<p><br /></p>
{message}

<p><br /></p>
<button class="button inside" on:click={() => dispatch('clickedOK')}>O.K.</button>
<p><br /></p>

<style>
</style>
