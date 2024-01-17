<script>
	import Seo from '$lib/components/Seo.svelte';
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import {
		baseURLScan,
		targetChainName,
		targetChainId,
		freedomChats,
		freedomChatsABI
	} from '../../constants.ts';

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
		var date = new Date(chat.timestamp * 1000);
		var hours = date.getHours();
		var minutes = '0' + date.getMinutes();
		var seconds = '0' + date.getSeconds();
		chat.time = `${hours}-${minutes}-${seconds}`;
		chats.push(chat);
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

<Seo title="Freedom Chats" />

<div class="text-center">
	<h2>Freedom Chats</h2>

	There is no
	<a href="https://otherparty.co.uk" target="_blank">real democracy</a> without freedom of speech.
	<p><br /></p>
	This is why we leverage the blockchain technology to ensure we can speak freely.
	<p><br /><br /><br /></p>
	{#if chatsLoaded}
		<div class="chat">
			{#each chats as chat, index}
				{#if index % 2 === 0}
					<div class="container">
						<p>{chat.text}</p>
						<span class="time-right">{chat.time}</span>
					</div>
				{:else}
					<div class="container darker">
						<p>{chat.text}</p>
						<span class="time-right">{chat.time}</span>
					</div>
				{/if}
			{/each}

			<div class="container darker">
				<img
					src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/7a58cce2-5e01-4e2a-b004-2623819d396f"
					alt="Avatar"
					class="right"
					style="width:100%;"
				/>
				<p>Hey! I'm fine. Thanks for asking!</p>
				<span class="time-left">11:01</span>
			</div>

			<div class="container">
				<img
					src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/7a58cce2-5e01-4e2a-b004-2623819d396f"
					alt="Avatar"
					style="width:100%;"
				/>
				<p>Sweet! So, what do you wanna do today?</p>
				<span class="time-right">11:02</span>
			</div>

			<div class="container darker">
				<img
					src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/7a58cce2-5e01-4e2a-b004-2623819d396f"
					alt="Avatar"
					class="right"
					style="width:100%;"
				/>
				<p>Nah, I dunno. Play soccer.. or learn more coding perhaps?</p>
				<span class="time-left">11:05</span>
			</div>
		</div>
	{:else}
		<button
			class="button"
			on:click={() => {
				connectToBlockchain();
			}}
		>
			Load Chats from Polygon zkEVM
		</button>
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
	<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
	<p><br /></p>
</div>

<style>
	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}

	.chat {
		margin: 0 auto;
		max-width: 800px;
		padding: 0 20px;
	}

	.container {
		border: 2px solid #dedede;
		background-color: #f1f1f1;
		border-radius: 5px;
		padding: 10px;
		margin: 10px 0;
	}

	.darker {
		border-color: #ccc;
		background-color: #ddd;
	}

	.container::after {
		content: '';
		clear: both;
		display: table;
	}

	.container img {
		float: left;
		max-width: 60px;
		width: 100%;
		margin-right: 20px;
		border-radius: 50%;
	}

	.container img.right {
		float: right;
		margin-left: 20px;
		margin-right: 0;
	}

	.time-right {
		float: right;
		color: #aaa;
	}

	.time-left {
		float: left;
		color: #999;
	}
</style>
