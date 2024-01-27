<script>
	import { ethers } from 'ethers';
	import { earthCoin, earthCoinABI, freedomCash, freedomCashABI } from '../../constants';
	import { getPOIsFromAssets, getTextWithoutLink, replaceContentToShowClickableLinks } from '$lib/helpers';
	import Map from './Map.svelte';
	export let asset;
	export let contract;
	export let provider;
	export let publicWalletAddressOfVisitor;

	let donationAmount;
	let visitorInformed = true;
	let amount;

	async function vote(assetID, up) {
		const amountToBeBoughtInWei = ethers.parseEther(amount.toString());
		const signer = await provider.getSigner();
		const fCContract = new ethers.Contract(freedomCash, freedomCashABI, signer);
		const buyPrice = await fCContract.getBuyPrice(amountToBeBoughtInWei);
		const cost = BigInt(amount) * buyPrice;
		const ethInWallet = BigInt(await provider.getBalance(publicWalletAddressOfVisitor));
		try {
			const estimatedGas = await contract.appreciateAsset.estimateGas(
				assetID,
				amountToBeBoughtInWei,
				buyPrice,
				{
					value: BigInt(cost)
				}
			);
			const estimatedGasCost = estimatedGas * (await provider.getFeeData()).gasPrice;
			if (ethInWallet < cost + BigInt(estimatedGasCost)) {
				throw new Error('you might enter a smaller amount');
			} else {
				if (up) {
					console.log(assetID, amountToBeBoughtInWei, buyPrice);
					await contract.appreciateAsset(assetID, amountToBeBoughtInWei, buyPrice, {
						value: BigInt(cost)
					});
				} else {
					await contract.depreciateAsset(assetID, amountToBeBoughtInWei, buyPrice, {
						value: BigInt(cost)
					});
				}
				visitorInformed = false;
			}
		} catch (error) {
			alert(error);
		}
	}
	async function donate(assetID) {
		const signer = await provider.getSigner();
		const eCContract = new ethers.Contract(earthCoin, earthCoinABI, signer);
		const amountToBeDonatedInWei = ethers.parseEther(donationAmount.toString());
		const buyPrice = await eCContract.getBuyPrice(amountToBeDonatedInWei);
		const cost = BigInt(donationAmount) * buyPrice;
		const ethInWallet = BigInt(await provider.getBalance(publicWalletAddressOfVisitor));
		const donationReceiver = await contract.assetCreators(assetID);
		try {
			const estimatedGas = await eCContract.donate.estimateGas(
				donationReceiver,
				amountToBeDonatedInWei,
				buyPrice,
				{
					value: BigInt(cost)
				}
			);
			const estimatedGasCost = estimatedGas * (await provider.getFeeData()).gasPrice;
			if (ethInWallet < cost + BigInt(estimatedGasCost)) {
				alert('you might enter a smaller amount');
			} else {
				console.log(`donating to ${donationReceiver} ${amountToBeDonatedInWei} ${buyPrice}`);
				await eCContract.donate(donationReceiver, amountToBeDonatedInWei, buyPrice, {
					value: BigInt(cost)
				});
			}
		} catch (error) {
			alert(error.message);
		}
	}
</script>

<div class="card {asset.reconciled ? 'reconciled' : 'open'}">
	{#if asset.embedLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.embedLink))}
		<p><br /></p>
		<div class="embedVideo">
			<object title="super" data={asset.embedLink}> </object>
		</div>
	{:else if asset.imageLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.imageLink))}
		<p><br /></p>

		<Map pois={getPOIsFromAssets([asset])} {contract}></Map>
		<!-- <div class="center">
			<img class="moniqueImage" src={asset.imageLink} alt="" />
		</div> -->
	{:else}
		{@html replaceContentToShowClickableLinks(asset.text)}
	{/if}

	<p><br /></p>
	<span class="score-up">Ups: {asset.upVoteScore} </span> vs.
	<span class="score-down">Downs: {asset.downVoteScore} </span>

	{#if asset.reconciled}
		<p><br /></p>
		<input
			bind:value={donationAmount}
			class="myInputField"
			type="number"
			placeholder="... enter donation amount ..."
			min="1"
			max="369"
			step="1"
		/>
		<p><br /></p>
		{#if donationAmount > 0}
			<button class="inside" on:click={() => donate(asset.id)}>Donate</button>
		{/if}
	{:else}
		<p><br /></p>
		<input
			bind:value={amount}
			class="myInputField"
			type="number"
			placeholder="... enter investment amount ..."
			min="1"
			max="369"
			step="1"
		/>
		<p><br /></p>
		{#if amount > 0}
			<button class="inside" on:click={() => vote(asset.id, true)}>Appreciate</button>
			<p><br /></p>
			<button class="inside" on:click={() => vote(asset.id, false)}>Depreciate</button>
			<p><br /></p>
		{/if}
		{#if asset.reconciliationFrom < new Date().getTime() / 1000 && amount == undefined && (asset.upVoteScore > 0 || asset.downVoteScore > 0)}
			<button class="inside" on:click={() => contract.reconcile(asset.id)}>Reconcile</button>
		{/if}
	{/if}
</div>
<p><br /><br /></p>

<style>
	.embedVideo {
		position: relative;
		padding-bottom: 56.25%; /* 16:9, for an aspect ratio of 1:1 change to this value to 100% */
	}
	object {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	.reconciled {
		background-color: #dddddd;
	}
	.score-up {
		background-color: green;
		color: white;
		min-width: 80px;
		width: 80px;
		padding-left: 18px;
		padding-right: 18px;
	}
	.score-down {
		background-color: red;
		color: white;
		padding-left: 9px;
		padding-right: 9px;
	}

	.card {
		border: 1px solid #dddddd;
		text-align: center;
		padding: 8px;
	}
</style>
