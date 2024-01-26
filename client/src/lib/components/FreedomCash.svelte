<script>
	import { onMount } from 'svelte';
	import { baseURLScan, freedomCash } from '../../constants.ts';
	import FreedomCashDetails from './FreedomCashDetails.svelte';
	import FreedomBets from './FreedomBets.svelte';
	import FreedomProjects from './FreedomProjects.svelte';
	import InvestmentInfo from './InvestmentInfo.svelte';
	import { connectToBlockchain } from '$lib/helpers.js';

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let projectID = 0;
	let contract;
	let showDetails;
	let invest;
	let showBets;
	let showProjects;
	let provider;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			contract = connectionData.contract;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			visitorIsConnectedViaBrowserWallet = true;
		}
	});

</script>

<section class="text-center">
	<div class="content">
		Freedom Cash makes crypto cypherpunk again. <p><br /></p>
		At the same time it is simple enough for Monique, Steffen and you.

		<p><br /><br /></p>
		<div class="center">
			<img class="moniqueImage" src="/monique-baumann.jpeg" alt="" />
		</div>
		<p><br /></p>

		I buy and sell
		<a href="{baseURLScan}token/{freedomCash}#code" target="_blank">Freedom Cash</a>,
		silver and gold.
		<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
		<p><br /><br /><br /></p>

		<button class="button" on:click={() => (showDetails = !showDetails)}>
			Show Details About Freedom Cash
		</button>
		{#if showDetails}
			<FreedomCashDetails></FreedomCashDetails>
		{/if}
		<p><br /><br /></p>
		<button class="button" on:click={() => (invest = !invest)}> Buy and Sell Freedom Cash </button>
	</div>
	{#if invest}
		<p><br /></p>
		<InvestmentInfo {publicWalletAddressOfVisitor} {provider} {contract}></InvestmentInfo>
	{/if}
	<p><br /><br /></p>
	<div class="content">
		<button class="button" on:click={() => (showBets = !showBets)}> Show Freedom Bets </button>
	</div>
	{#if showBets}
		<p><br /></p>
		<FreedomBets {projectID}></FreedomBets>
	{/if}

	<p><br /><br /></p>
	<div class="content">
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
				Connect To Blockchain
			</button>
			<p><br /></p>
		{/if}
		<button class="button" on:click={() => (showProjects = !showProjects)}>
			Show Freedom Projects
		</button>
	</div>
	{#if showProjects}
		<p><br /></p>
		<FreedomProjects></FreedomProjects>
	{/if}

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
