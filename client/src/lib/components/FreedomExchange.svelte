<script>
	import { browser } from '$app/environment';
	import { connectToBlockchain } from '$lib/helpers';
	import { projectIDFreedomExchange, votingPeriodMinLength } from '../../constants';
	import Map from './Map.svelte';
	import { onMount } from 'svelte';

	let publicWalletAddressOfVisitor = '';
	let contract;
	let provider;
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let searchTerm = '';
	let filteredGoods = [];
	let goods = [];
	let typingActive = false;
	let readyForDisplay = false;
	let prepareFreedomGood = false;
	let long = 50;
	let lat = 50;
	let newFreedomExchange;

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
		}
	});
	const onKeyDown = () => {
		filteredGoods = [...goods];
		if (typingActive === false) {
			typingActive = true;

			setTimeout(() => {
				const currentFilterResult = [];
				for (const good of filteredGoods) {
					const stringifiedGood = JSON.stringify(good);
					if (stringifiedGood.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
						currentFilterResult.push(good);
					}
				}

				filteredGoods = [...currentFilterResult];
				typingActive = false;
			}, 1000 * 1);
		}
	};

	async function addFreedomExchange(projectID) {
		// const hash = "0x" + hashJs.sha256().update(newAsset).digest('hex')
		const assetID = (await contract.assetCounter()) + BigInt(1);
		console.log(
			`adding to ${projectID} asset ${newFreedomExchange} ${assetID} ${votingPeriodMinLength}`
		);
		await contract.addAsset(projectID, newFreedomExchange, assetID, votingPeriodMinLength);
	}
</script>

<div class="assets">
	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:value={searchTerm}
		class="myInputField"
		type="text"
		placeholder="... filter freedom goods ..."
		on:keydown={onKeyDown}
		autofocus
	/>

	<p><br /></p>

	<!-- svelte-ignore a11y-autofocus -->
	{#if browser}
		<Map {long} {lat} showZoomToByLocationButton={true} map></Map>
	{/if}
	<p><br /></p>
	<!-- svelte-ignore a11y-autofocus -->
	{#if readyForDisplay}
		{#each filteredGoods as asset, index}
			tbd
		{/each}
	{:else}
		... loading data from blockchain ...
	{/if}
	<p><br /></p>
	<button
		on:click={() => {
			prepareFreedomGood = !prepareFreedomGood;
		}}>Add Freedom Good</button
	>
	<p><br></p>
	<input
		bind:value={newFreedomExchange}
		class="myInputField"
		type="text"
		placeholder="... add new treasure ..."
	/>
	<p><br /></p>
	{#if newFreedomExchange}
		<button class="inside" on:click={() => addFreedomExchange(projectIDFreedomExchange)}
			>Add Treasure</button
		>
	{/if}
</div>

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
