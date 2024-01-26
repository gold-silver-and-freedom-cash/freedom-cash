<script>
	import { browser } from '$app/environment';
	import { connectToBlockchain, loadAssets } from '$lib/helpers';
	import { projectIDFreedomExchange } from '../../constants';
	import Map from './Map.svelte';
	import { onMount } from 'svelte';

	let publicWalletAddressOfVisitor = '';
	let contract;
	let provider;
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let searchTerm = '';
	let filteredPOIs = [];
	let pois = [];
	let typingActive = false;
	let readyForDisplay = false;
	let prepareFreedomGood = false;

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
			getPOIsFromAssets(assets)
			filteredPOIs = [...pois];
			readyForDisplay = true;

		}
	});
	const onKeyDown = () => {
		filteredPOIs = [...pois];
		if (typingActive === false) {
			typingActive = true;

			setTimeout(() => {
				const currentFilterResult = [];
				for (const good of filteredPOIs) {
					const stringifiedGood = JSON.stringify(good);
					if (stringifiedGood.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
						currentFilterResult.push(good);
					}
				}

				filteredPOIs = [...currentFilterResult];
				typingActive = false;
			}, 1000 * 1);
		}
	};

	function getPOIsFromAssets(assets){
		for (const asset of assets) {
			pois.push({lat: asset.lat, lon: asset.lon, text: asset.text})
		}
	}
</script>

{#if readyForDisplay}
	<div class="assets">
		<p><br /></p>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			bind:value={searchTerm}
			class="myInputField"
			type="text"
			placeholder="... filter freedom exchanges ..."
			on:keydown={onKeyDown}
			autofocus
		/>

		<p><br /></p>

		<!-- svelte-ignore a11y-autofocus -->
		{#if browser}
			<Map pois={filteredPOIs} map {contract}></Map>
		{/if}
		<p><br /></p>
		
		<p><br /></p>
		{#if prepareFreedomGood}
			Please zoom into the map and click at the specific place on the map.
		{/if}
	</div>
{/if}

<style>
	@media only screen and (min-width: 800px) {
		/* For tablets: */
		.assets {
			width: 63%;
			margin-left: auto;
			margin-right: auto;
			padding: 0;
		}
	}
</style>
