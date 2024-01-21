<script>
	import BlockChainData from './BlockChainData.svelte';
	import SellFreedomCash from '$components/SellFreedomCash.svelte';
	import InvestIntoFreedomCash from '$components/InvestIntoFreedomCash.svelte';
	import {
		baseURLScan,
		smartContractAddress,
		freedomCashABI,
		targetChainName,
		targetChainId
	} from '../../constants.ts';
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	export let publicWalletAddressOfVisitor;
	export let contract;
	export let provider;

	let readyForDisplay;
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chainId = '';
	let projectID = 0;

	let accounts;
	let showDetails;
	let invest;
	let showBets;
	let showProjects;

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
			readyForDisplay = true;
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

{#if readyForDisplay}
	<div class="content">
		<h2 class="text-center">Buy And Sell</h2>
		<InvestIntoFreedomCash {contract} {publicWalletAddressOfVisitor} {provider}
		></InvestIntoFreedomCash>
		<p><br /><br /></p>
		<SellFreedomCash {contract}></SellFreedomCash>
		<p><br /><br /><br /></p>
		<BlockChainData {publicWalletAddressOfVisitor} {contract} {provider}></BlockChainData>
	</div>
{/if}

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
