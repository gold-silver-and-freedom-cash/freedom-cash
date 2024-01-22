<script>
	import { ethers } from 'ethers';
	import { freedomCash, freedomCashABI } from '../../constants';
	export let asset;
	export let contract;
	export let provider;
	export let publicWalletAddressOfVisitor;
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
				alert('you might enter a smaller amount');
			} else {
				try {
					if (up) {
						await contract.appreciateAsset(assetID, amountToBeBoughtInWei, buyPrice, {
							value: BigInt(cost)
						});
					} else {
						await contract.depreciateAsset(assetID, amountToBeBoughtInWei, buyPrice, {
							value: BigInt(cost)
						});
					}
					visitorInformed = false;
				} catch (error) {
					alert('you might enter a smaller amount');
				}
			}
		} catch (error) {
			alert(error);
		}
	}
</script>

<div class="card {asset.reconciled ? 'reconciled' : 'open'}">
	{asset.text}
	<p><br /></p>
	<span class="score-up">Ups: {asset.upVoteScore} </span> vs.
	<span class="score-down">Downs: {asset.downVoteScore} </span>

	{#if !asset.reconciled}
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
		{#if asset.reconciliationFrom < new Date().getTime() / 1000}
			<button class="inside" on:click={() => contract.reconcile(asset.id)}>Reconcile</button>
		{/if}
	{/if}
</div>
<p><br /><br /></p>

<style>
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
