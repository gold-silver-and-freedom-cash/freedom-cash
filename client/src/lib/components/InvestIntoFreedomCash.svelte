<script>
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import FeedbackToVisitor from './FeedbackToVisitor.svelte';
	import { baseURLScan, smartContractAddress } from '../../constants.ts';
	export let contract;
	export let provider;
	export let publicWalletAddressOfVisitor;
	let amountToBeBought = 1;
	let visitorInformed = true;
	let etherAmountAvailable = 0;

	onMount(async () => {
		etherAmountAvailable = await provider.getBalance(publicWalletAddressOfVisitor);
	});
	async function buyFreedomCash() {
		const amountToBeBoughtInWei = ethers.parseEther(amountToBeBought.toString());
		const buyPrice = await contract.getBuyPrice(amountToBeBoughtInWei);
		const cost = BigInt(amountToBeBought) * buyPrice;
		const ethInWallet = BigInt(await provider.getBalance(publicWalletAddressOfVisitor));
		try {
			const estimatedGas = await contract.buyFreedomCash.estimateGas(
				amountToBeBoughtInWei,
				buyPrice,
				{
					value: BigInt(cost)
				}
			);
			const estimatedGasCost = estimatedGas * (await provider.getFeeData()).gasPrice;
			if (ethInWallet < cost + BigInt(estimatedGasCost)) {
				alert('you might enter a smaller amount');
			} else {
				try {
					let result = await contract.buyFreedomCash(amountToBeBoughtInWei, buyPrice, {
						value: BigInt(cost)
					});
					visitorInformed = false;
					console.log(result);
				} catch (error) {
					alert('you might enter a smaller amount');
				}
			}
		} catch (error) {
			alert(error);
		}
	}
</script>

{#if visitorInformed}
	{#if etherAmountAvailable > 0}
		How much Freedom Cash do you want to buy?
		<p><br /></p>
		<input
			bind:value={amountToBeBought}
			class="myInputField"
			type="number"
			placeholder="e.g. 369 Freedom Cash"
			min="0.1"
			max="999999"
			step="0.1"
		/>
		<p><br /></p>
		{#if amountToBeBought > 0}
			<button class="inside" on:click={() => buyFreedomCash()}>Buy Freedom Cash</button>
		{/if}
	{:else}
		In order to invest into
		<a href="{baseURLScan}token/{smartContractAddress}#code#L891" target="_blank">Freedom Cash</a>
		, you need to have some Ether on the Polygon zkEVM Blockchain.
		<p><br /></p>
		You can transfer some Ether from the Ethereum Mainnet to the Polygon zkEVM Blockchain via
		<a href="https://portal.polygon.technology/bridge" target="_blank"
			>portal.polygon.technology/bridge</a
		>.
		<p><br /></p>
	{/if}
{:else}
	<FeedbackToVisitor
		on:clickedOK={() => {
			visitorInformed = true;
		}}
	></FeedbackToVisitor>
{/if}

<style>
</style>
