<script>
	import { onMount } from 'svelte';
	import Assets from './AssetsExplorer.svelte';
	import { connectToBlockchain } from '$lib/helpers.js';

	export let projectID;

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let contract;

	let provider;
	let claimableRewards = 0;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			contract = connectionData.fBContract;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			claimableRewards = await contract.getClaimableRewards(publicWalletAddressOfVisitor);
			visitorIsConnectedViaBrowserWallet = true;
		}
	});
	async function claimRewards() {
		await contract.claimRewards();
	}
</script>

<section class="text-center">
	<div class="content">
		<p><br /></p>
		Freedom Bets is an incentive system for truth, respect & direct democracy.
		<p><br /></p>

		{#if !visitorHasBrowserWallet}
			Please install a browserwallet which you trust like
			<a href="https://metamask.io" target="_blank">metamask.io</a>
			or use the integrated browserwallet in the
			<a href="https://brave.com" target="_blank">brave.com</a> browser and come again.
		{:else if publicWalletAddressOfVisitor == ''}
			<p><br /></p>
			<button
				class="button"
				on:click={() => {
					connectToBlockchain();
				}}
			>
				Enter Freedom
			</button>
		{:else}
			<Assets {contract} {publicWalletAddressOfVisitor} {provider} {projectID}></Assets>
			{#if claimableRewards > 0}
				<p><br /></p>
				<button class="button inside" on:click={() => claimRewards()}> Claim Rewards </button>
			{/if}
		{/if}
	</div>
</section>

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
</style>
