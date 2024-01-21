<script>
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import { freedomBets, freedomBetsABI, targetChainId, targetChainName } from '../../constants.ts';
	import Assets from './Assets.svelte';

	export let projectID;
	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chainId = '';
	let contract;

	let accounts;
	let showDetails;
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
									chainId: targetChainId,
									chainName: 'Polygon zkEVM',
									rpcUrls: ['https://zkevm-rpc.com'],
									nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
									blockExplorerUrls: ['https://zkevm.polygonscan.com']
								}
							]
						});
					}
				} else {
					buttonText = 'Invest Into Freedom Cash';
				}
				accounts = await window.ethereum.request({
					method: 'eth_requestAccounts'
				});

				provider = new ethers.BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();
				contract = new ethers.Contract(freedomBets, freedomBetsABI, signer);

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
		<h2 class="text-center">Freedom Bets</h2>
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
		{/if}
		<p><br /><br /></p>
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
