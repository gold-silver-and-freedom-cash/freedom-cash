<script>
	import { onMount } from 'svelte';
	import {
		projectIDGeoCaching,
		targetChainName,
		votingPeriodMinLength
	} from '../../constants.ts';
	import { connectToBlockchain } from '$lib/helpers.js';
	import AssetsExplorer from './AssetsExplorer.svelte';

	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let publicWalletAddressOfVisitor = '';
	let contract;
	let provider;
	let newTreasure = '';
	let message = '';
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

<div class="text-center">
	{#if contract != undefined}
		<div class="content">
			Geocachers support Freedom Cash.
			<p><br /></p>
			Once you have created and printed a wallet, you can hide it at any beautiful place.
			<p><br /></p>
			After that you can share a link to a photo or video of that place. I was here and hided ...

			<p><br /><br /><br /></p>
			<AssetsExplorer {contract} {publicWalletAddressOfVisitor} {provider} projectID={projectIDGeoCaching}
			></AssetsExplorer>
			<p><br /></p>
			{#if visitorInformed}
				<button
					on:click={() => {
						prepareNewTreasure = !prepareNewTreasure;
					}}>Add Treasure</button
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
						placeholder="... add new treasure ..."
					/>
					<p><br /></p>
					{#if newTreasure}
						<button class="inside" on:click={() => addTreasure(projectIDGeoCaching)}
							>Add Treasure</button
						>
					{/if}
				{/if}
			{:else}
				<!-- <FeedbackToVisitor
		smartContractAddress={freedomBets}
		{message}
		on:clickedOK={() => {
			visitorInformed = true;
		}}
	></FeedbackToVisitor> -->
			{/if}
			<p><br /><br /></p>
		</div>
	{/if}
	<p><br /><br /></p>
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
</div>

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
