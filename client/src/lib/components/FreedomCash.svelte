<script>
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import {
		baseURLScan,
		smartContractAddress,
		freedomCashABI,
		targetChainName,
		targetChainId
	} from '../../constants.ts';
	import FreedomCashDetails from './FreedomCashDetails.svelte';
	import FreedomBets from './FreedomBets.svelte';
	import FreedomProjects from './FreedomProjects.svelte';
	import InvestmentInfo from './InvestmentInfo.svelte';

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chainId = '';
	let projectID = 0;
	let contract;
	let accounts;
	let showDetails;
	let invest;
	let showBets;
	let showProjects;
	let provider;
	let buttonText = `Connect To ${targetChainName}`;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			await connectToBlockchain();
		}
	});

	async function connectToBlockchain() {
		if (visitorHasBrowserWallet) {
			try {
				chainId = await window.ethereum.request({
					method: 'eth_chainId'
				});

				if (chainId !== targetChainId) {
					try {
						await window.ethereum.request({
							method: 'wallet_switchEthereumChain',
							params: [{ chainId: targetChainId }]
						});
					} catch (error) {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: '0x44d',
									chainName: 'Polygon zkEVM',
									rpcUrls: ['https://zkevm-rpc.com'],
									nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
									blockExplorerUrls: ['https://zkevm.polygonscan.com']
								}
							]
						});
					}
				}
				accounts = await window.ethereum.request({
					method: 'eth_requestAccounts'
				});

				provider = new ethers.BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();
				contract = new ethers.Contract(smartContractAddress, freedomCashABI, signer);

				publicWalletAddressOfVisitor = accounts[0];
				window.ethereum.on('chainChanged', handleChainChanged);
				visitorIsConnectedViaBrowserWallet = true;
			} catch (error) {
				alert(error.message);
			}

			visitorIsConnectedViaBrowserWallet = true;
		}
		window.ethereum.on('accountsChanged', function (accounts) {
			alert(`the account has been changed via Metamask. So I reload.`);
			window.location.reload();
		});
	}
	function handleChainChanged(chainId) {
		// await connectToBlockchain()
		alert(`the chain has been changed via Metamask. So I reload.`);
		window.location.reload();
	}
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
		<a href="{baseURLScan}token/{smartContractAddress}#code#L891" target="_blank">Freedom Cash</a>,
		silver and gold.
		<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
		<p><br /><br /></p>

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
		<p><br /><br /></p>
		<InvestmentInfo {publicWalletAddressOfVisitor} {provider} {contract}></InvestmentInfo>
	{/if}
	<p><br /><br /></p>
	<div class="content">
		<button class="button" on:click={() => (showBets = !showBets)}> Show Freedom Bets </button>
	</div>
	{#if showBets}
		<p><br /><br /></p>
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
				{buttonText}
			</button>
		{/if}
		<button class="button" on:click={() => (showProjects = !showProjects)}>
			Show Freedom Projects
		</button>
	</div>
	{#if showProjects}
		<p><br /><br /></p>
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
	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}
</style>
