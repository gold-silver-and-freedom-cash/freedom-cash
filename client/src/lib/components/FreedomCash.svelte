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
	import BlockChainData from './BlockChainData.svelte';
	import SellFreedomCash from '$components/SellFreedomCash.svelte';
	import InvestIntoFreedomCash from '$components/InvestIntoFreedomCash.svelte';
	import FreedomCashDetails from './FreedomCashDetails.svelte';

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chainId = '';
	let contract;
	let accounts;
	let showDetails;
	let provider;
	let buttonText = `Connect To ${targetChainName}`;

	onMount(() => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
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
				} else {
					buttonText = 'Invest Into Freedom Cash';
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
	Freedom Cash makes crypto cypherpunk again, while being simple enough for everyone who cares.
	<p><br /></p>

	<p><br /><br /></p>
	<div class="center">
		<img class="moniqueImage" src="/monique-baumann.jpeg" alt="" />
	</div>
	<p><br /></p>

	I buy and sell
	<a href="{baseURLScan}token/{smartContractAddress}#code#L891" target="_blank">Freedom Cash</a>,
	silver and gold.
	<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
	<p><br /><br></p>

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
	{:else}
		<h4 class="text-center">State of the Game</h4>
		<BlockChainData {publicWalletAddressOfVisitor} {contract} {provider}></BlockChainData>
		<p><br /><br /><br /></p>
		<InvestIntoFreedomCash {contract} {publicWalletAddressOfVisitor} {provider}
		></InvestIntoFreedomCash>
		<p><br /><br /></p>
		<SellFreedomCash {contract}></SellFreedomCash>
	
	{/if}
	<p><br /><br></p>
	{#if !showDetails}
		<button
			class="button"
			on:click={() => showDetails = !showDetails}
		>
			Show Details
		</button>
	{:else}
	<FreedomCashDetails></FreedomCashDetails>
	{/if}
	
</section>

<style>
	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}
</style>
