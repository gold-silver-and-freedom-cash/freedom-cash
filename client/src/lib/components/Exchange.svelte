<script>
	import { onMount } from 'svelte';
	import MapOfExchanges from './MapOfExchanges.svelte';
	import { getTextWithoutLink, replaceContentToShowClickableLinks } from '$lib/helpers';
	export let poi;
	export let contract;
	export let publicWalletAddressOfVisitor;
	export let provider;
	let donationAmount;
	let visitorInformed = true;
	let enrichedPOI;
	let amount;
	let showMap;
	let readyForDisplay = false;

	const assets = [];

	onMount(() => {
		enrichedPOI = poi;
		let startIndex = poi.text.indexOf('https://rumble.com/embed/');
		if (startIndex !== -1) {
			const rest = poi.text.substr(startIndex, poi.text.length - 1);
			console.log(rest);
			const endIndex = rest.indexOf(' ');
			const rumbleLink = poi.text.substr(startIndex, endIndex);
			console.log(rumbleLink);
			if (endIndex === -1) {
				enrichedPOI.embedLink = rest;
			} else {
				enrichedPOI.embedLink = rest.substr(0, endIndex);
			}
		}
		readyForDisplay = true;
	});
</script>

{#if readyForDisplay}
	<div class="card">
		{#if enrichedPOI.embedLink}
			{getTextWithoutLink(poi.text, enrichedPOI.embedLink)}
			<p><br></p>
			<div class="embedVideo">
				<object title="super" data={`${enrichedPOI.embedLink}`}> </object>
			</div>
		{:else}
			{poi.text}
		{/if}
	</div>
{/if}
<!-- <Asset {asset} {contract} {provider} {publicWalletAddressOfVisitor}></Asset> -->

<p><br /></p>
<button on:click={() => (showMap = !showMap)}>Show On Map</button>
<p><br /></p>
{#if showMap}
	<div class="specificMap">
		<MapOfExchanges height={200} pois={[poi]} {contract}></MapOfExchanges>
	</div>
{/if}

<p><br /><br /></p>

<!-- <div class="card {asset.reconciled ? 'reconciled' : 'open'}"> -->
<!-- {#if asset.embedLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.embedLink))}
		<p><br /></p>
		<div class="embedVideo">
			<object title="super" data={asset.embedLink}> </object>
		</div>
	{:else if asset.imageLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.imageLink))}
		<p><br /></p>

		<Map projectID={asset.projectID} pois={getPOIsFromAssets([asset])} {contract}></Map>
	{:else}
		{@html replaceContentToShowClickableLinks(asset.text)}
		{#if getPOIsFromAssets([asset]).length > 0}
			<p><br></p>
			<Map projectID={asset.projectID} pois={getPOIsFromAssets([asset])} {contract}></Map>
		{/if}
	{/if} -->

<!-- <p><br /></p>
	<span class="score-up">Ups: {asset.upVoteScore} </span> vs.
	<span class="score-down">Downs: {asset.downVoteScore} </span> -->

<!-- {#if asset.reconciled}
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
	{/if} -->
<!-- </div> -->
<!-- <div class="card {asset.reconciled ? 'reconciled' : 'open'}">
	{#if asset.embedLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.embedLink))}
		<p><br /></p>
		<div class="embedVideo">
			<object title="super" data={asset.embedLink}> </object>
		</div>
	{:else if asset.imageLink !== ''}
		{@html replaceContentToShowClickableLinks(getTextWithoutLink(asset.text, asset.imageLink))}
		<p><br /></p>

		<Map projectID={asset.projectID} pois={getPOIsFromAssets([asset])} {contract}></Map>
	{:else}
		{@html replaceContentToShowClickableLinks(asset.text)}
		{#if getPOIsFromAssets([asset]).length > 0}
			<p><br></p>
			<Map projectID={asset.projectID} pois={getPOIsFromAssets([asset])} {contract}></Map>
		{/if}
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
</div> -->
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
