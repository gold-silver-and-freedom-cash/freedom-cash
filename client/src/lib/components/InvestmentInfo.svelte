<script lang="ts">
	import BlockChainData from './BlockChainData.svelte';
	import SellFreedomCash from '$components/SellFreedomCash.svelte';
	import InvestIntoFreedomCash from '$components/InvestIntoFreedomCash.svelte';
	import { onMount } from 'svelte';
	import { connectToBlockchain } from '$lib/helpers';
	export let publicWalletAddressOfVisitor = '';
	export let contract = undefined;
	export let provider = undefined;

	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			if (publicWalletAddressOfVisitor === '') {
				const connectionData = await connectToBlockchain();
				provider = connectionData.provider;
				contract = connectionData.contract;
				publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			}
			visitorIsConnectedViaBrowserWallet = true;
		}
	});
</script>

{#if visitorIsConnectedViaBrowserWallet}
	<div class="content">
		<p><br /></p>
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
