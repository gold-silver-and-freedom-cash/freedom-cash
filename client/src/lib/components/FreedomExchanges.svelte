<script>
	import { browser } from '$app/environment';
	import { connectToBlockchain, getPOIsFromAssets, loadAssets } from '$lib/helpers';
	import { projectIDFreedomExchange } from '../../constants';
	import Map from './Map.svelte';
	import { onMount } from 'svelte';
	import MapExplorer from './MapExplorer.svelte';

	let publicWalletAddressOfVisitor = '';
	let contract;
	let provider;
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let pois = [];
	let readyForDisplay = false;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			contract = connectionData.fBContract;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			visitorIsConnectedViaBrowserWallet = true;
			readyForDisplay = false;
			const assets = await loadAssets(contract, projectIDFreedomExchange);
			pois = getPOIsFromAssets(assets);
			readyForDisplay = true;
		}
	});
	
</script>

{#if readyForDisplay}
	<MapExplorer {pois} {contract} placeHolderText="... filter freedom exchanges ..."></MapExplorer>
{/if}

<style>
	
</style>
