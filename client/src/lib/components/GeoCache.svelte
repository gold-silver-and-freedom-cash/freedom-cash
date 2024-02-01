<script>
	import { ethers } from 'ethers';
	import { earthCoinABI, freedomCash, freedomCashABI } from '../../constants';
	import {
		getPOIsFromAssets,
		getTextWithoutLink,
		replaceContentToShowClickableLinks
	} from '$lib/helpers';
	import Map from './MapOfExchanges.svelte';
	import MapOfGeoCaches from './MapOfGeoCaches.svelte';
	export let poi;

	let donationAmount;
	let visitorInformed = true;
	let amount;
	let showMap
</script>

<div class="embedVideo">
	<object title="super" data={`https://rumble.com/embed/${poi.text}`}> </object>
</div>
<p><br /></p>
<button on:click={() => (showMap = !showMap)}>Show On Map</button>
<p><br /></p>
{#if showMap}
	<div class="specificMap">
		<MapOfGeoCaches height={200} pois={[poi]}></MapOfGeoCaches>
	</div>
{/if}

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
</style>
