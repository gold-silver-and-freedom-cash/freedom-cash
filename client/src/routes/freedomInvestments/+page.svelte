<script>
	import Seo from '$lib/components/Seo.svelte';
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import {
		baseURLScan,
		targetChainName,
		targetChainId,
		freedomChatsABI
	} from '../../constants.ts';
	import InvestmentInfo from '$components/InvestmentInfo.svelte';

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chatsLoaded = false;
	let chainId = '';
	let contract;
	let accounts;
	let chats = [];
	let provider;
	let buttonText = `Connect To ${targetChainName}`;

	onMount(async () => {
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
				contract = new ethers.Contract(freedomChats, freedomChatsABI, signer);

				publicWalletAddressOfVisitor = accounts[0];
				window.ethereum.on('chainChanged', handleChainChanged);
				await loadChats();
				visitorIsConnectedViaBrowserWallet = true;
			} catch (error) {
				alert(error.message);
			}

			visitorIsConnectedViaBrowserWallet = true;
		}
		window.ethereum.on('accountsChanged', await loadChats());
	}
	async function loadChats() {
		const raw = await contract.chats(1);

		const chat = {
			from: raw[0],
			text: raw[1],
			refersTo: raw[2],
			donations: raw[3],
			claimed: raw[4],
			timestamp: Number(raw[5])
		};
		// var date = new Date(chat.timestamp * 1000);
		// var hours = date.getHours();
		// var minutes = '0' + date.getMinutes();
		// var seconds = '0' + date.getSeconds();
		// chat.time = `${hours}-${minutes}-${seconds}`;
		chats.push(chat);
		chatsLoaded = true;
	}
	async function handleChainChanged(chainId) {
		// await connectToBlockchain()
		alert(`the chain has been changed via Metamask. So I reload.`);
		// window.location.reload();
		await loadChats();
		visitorIsConnectedViaBrowserWallet = true;
	}
</script>

<InvestmentInfo {publicWalletAddressOfVisitor} {provider} {contract}></InvestmentInfo>
<style>

</style>
