<script>
	import { onMount } from 'svelte';
	import { projectIDGeoCaching, targetChainName, votingPeriodMinLength } from '../../constants.ts';
	import { connectToBlockchain, getPOIsFromAssets, loadAssets } from '$lib/helpers.js';
	import AssetsExplorer from './AssetsExplorer.svelte';
	import MapExplorer from './MapExplorer.svelte';

	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let publicWalletAddressOfVisitor = '';
	let contract;
	let provider;
	let newTreasure = '';
	let message = '';
	let assets = [];
	let pois = [];
	let visitorInformed = true;
	let prepareNewTreasure = false;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			contract = connectionData.fBContract;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			assets = await loadAssets(contract, projectIDGeoCaching);
			pois = getPOIsFromAssets(assets);
			visitorIsConnectedViaBrowserWallet = true;
		}
	});

	async function addTreasure(projectID) {
		// const hash = "0x" + hashJs.sha256().update(newAsset).digest('hex')
		const assetID = (await contract.assetCounter()) + BigInt(1);
		console.log(`adding to ${projectID} asset ${newTreasure} ${assetID} ${votingPeriodMinLength}`);
		await contract.addAsset(projectID, newTreasure, assetID, votingPeriodMinLength);
	}
</script>

{#if visitorIsConnectedViaBrowserWallet}
	Once you have created and printed a wallet, you can hide it at any beautiful place.
	<p><br /></p>
	After that you can share a link to a photo or video of that place.
	<p><br /></p>
	<MapExplorer projectID={projectIDGeoCaching} assetType="treasury" filterRequired={false} {pois} {contract} placeHolderText="... filter freedom treasuries ..."></MapExplorer>

	<div class="content">
		<AssetsExplorer placeHolderText="... filter treasuries ..." {contract} {publicWalletAddressOfVisitor} {provider} {assets}></AssetsExplorer>

		<p><br /></p>
		{#if visitorInformed}
			<!-- <button
				on:click={() => {
					prepareNewTreasure = !prepareNewTreasure;
				}}>Add Treasury</button
			>
			{#if prepareNewTreasure}
				<p><br /></p>
				<div class="center">
					<img
						src="https://github.com/monique-baumann/freedom-cash/assets/145258627/97bc4bbf-2b58-4806-92eb-d6517f08685e"
						alt="example"
					/>
				</div>
				<p><br /></p>
				<input
					bind:value={newTreasure}
					class="myInputField"
					type="text"
					placeholder="... add new treasury ..."
				/>
				<p><br /></p>
				{#if newTreasure}
					<button class="inside" on:click={() => addTreasure(projectIDGeoCaching)}
						>Add Treasury</button
					>
				{/if}
			{/if} -->
		{:else}
			<!-- <FeedbackToVisitor
		smartContractAddress={freedomBets}
		{message}
		on:clickedOK={() => {
			visitorInformed = true;
		}}
	></FeedbackToVisitor> -->
		{/if}
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

	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}
</style>
