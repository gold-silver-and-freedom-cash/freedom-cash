<script>
	import { onMount } from 'svelte';
	import FeedbackToVisitor from './FeedbackToVisitor.svelte';
	import { ethers } from 'ethers';
	import { smartContractAddress } from '../../constants';
	export let contract;

	let amount = 1;
	let sellPrice = 0;
	let visitorInformed = true;

	onMount(async () => {
		sellPrice = await contract.getSellPrice();
	});
	async function sellFreedomCash() {
		try {
			sellPrice = await contract.getSellPrice(); // to be up to date
			const amountToBeSoldInWei = ethers.parseEther(amount.toString());
			let result = await contract.sellFreedomCash(amountToBeSoldInWei, sellPrice.toString());
			visitorInformed = false;
			console.log(`result: ${result}`);
		} catch (error) {
			alert(error.message);
		}
	}
</script>

<section class="text-center">
	{#if visitorInformed}
		How much would you like to sell?
		<p><br /></p>

		<input
			bind:value={amount}
			class="myInputField"
			type="number"
			placeholder="your investment e.g. 0.000000009 ETH"
		/>
		<p><br /></p>

		{#if amount > 0}
			<button class="inside" on:click={() => sellFreedomCash()}>Sell Freedom Cash</button>
		{/if}
	{:else}
		<FeedbackToVisitor {smartContractAddress}
			on:clickedOK={() => {
				visitorInformed = true;
			}}
		></FeedbackToVisitor>
	{/if}
</section>

<style>
</style>
