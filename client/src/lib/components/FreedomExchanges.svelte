<script>
	import { onMount } from 'svelte';
	import { exchanges, exchangesABI } from '../../constants.ts';
	import { connectToBlockchain } from '$lib/helpers.js';
	import { ethers } from 'ethers';
	import MapOfExchanges from './MapOfExchanges.svelte';
	import Exchange from './Exchange.svelte';

	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let publicWalletAddressOfVisitor = '';
	let provider;
	let contract
	let pois = [];
	let dataLoaded = false;
	let showMap = false;
	async function getExchanges(contract) {
		const numberOfPois = await contract.counter();
		let counter = 0;
		while (counter < numberOfPois) {
			counter++;
			let poiRaw = await contract.freedomCaches(counter);
			const location = ethers.decodeBytes32String(poiRaw[0]);
			const splitted = location.split('œ');
			const description = poiRaw[1];
			const poi = { lat: splitted[0], lon: splitted[1], text: description };
			pois.push(poi);
		}
	}
	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			const signer = await provider.getSigner();
			contract = new ethers.Contract(exchanges, exchangesABI, signer);
			await getExchanges(contract);
			dataLoaded = true;
			visitorIsConnectedViaBrowserWallet = true;
		}
	});
</script>

{#if visitorIsConnectedViaBrowserWallet}
	<div class="content">
		<button on:click={() => showMap = !showMap} >Show Overview</button>
		{#if dataLoaded && showMap}
			<p><br></p>
			<MapOfExchanges {pois} {contract}></MapOfExchanges>
		{/if}

		<p><br /><br /></p>
		<div class="assets">
			{#each pois as poi, index}
				<Exchange {poi} {contract} {publicWalletAddressOfVisitor} {provider}></Exchange>
			{/each}
		</div>

		<p><br /></p>
	</div>
{/if}
<div class="center">
	<img
		class="moniqueImage"
		src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/7a58cce2-5e01-4e2a-b004-2623819d396f"
		alt="tea"
	/>
</div>
<p><br /></p>

If we do not own freedom, we might own nothing at all.
<i>Steffen</i>
<p><br /></p>

<style>
	@media only screen and (min-width: 800px) {
		/* For tablets: */
		.content {
			width: 63%;
			margin-left: auto;
			margin-right: auto;
			padding: 0;
			text-align: center;
		}
	}
	.assets {
		max-height: 630px;
		overflow-y: scroll;
	}
</style>
