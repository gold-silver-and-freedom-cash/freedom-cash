<script>
	import Map from './Map.svelte';

	export let contract;
	export let pois = [];
	export let placeHolderText = "... type to filter ...";

	let searchTerm = '';
	let filteredPOIs = pois;
	let typingActive = false;
	let readyForDisplay = false;
	let prepareFreedomGood = false;

	const onKeyDown = () => {
		filteredPOIs = [...pois];
		if (typingActive === false) {
			typingActive = true;

			setTimeout(() => {
				const currentFilterResult = [];
				for (const filteredPOI of filteredPOIs) {
					const stringifiedGood = JSON.stringify(filteredPOI);
					if (stringifiedGood.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
						currentFilterResult.push(filteredPOI);
					}
				}

				filteredPOIs = [...currentFilterResult];
				typingActive = false;
			}, 1000 * 1);
		}
	};
	
</script>

<div class="assets">
	<p><br /></p>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:value={searchTerm}
		class="myInputField"
		type="text"
		placeholder={placeHolderText}
		on:keydown={onKeyDown}
		autofocus
	/>

	<p><br /></p>

	<Map pois={filteredPOIs} {contract}></Map>
	<p><br /></p>

	<p><br /></p>
	{#if prepareFreedomGood}
		Please zoom into the map and click at the specific place on the map.
	{/if}
</div>

<style>
	@media only screen and (min-width: 800px) {
		/* For tablets: */
		.assets {
			width: 63%;
			margin-left: auto;
			margin-right: auto;
			padding: 0;
		}
	}
</style>
