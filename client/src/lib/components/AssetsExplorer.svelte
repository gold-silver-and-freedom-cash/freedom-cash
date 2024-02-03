<script>
	import { onMount } from 'svelte';
	import Asset from './Asset.svelte';
	export let contract;
	export let publicWalletAddressOfVisitor;
	export let provider;
	export let placeHolderText = "... filter ...";
	export let assets = [];
	let searchTerm = '';

	let filteredassets = [];
	let readyForDisplay = false;
	let typingActive = false;

	onMount(async () => {
		readyForDisplay = false;
		filteredassets = [...assets];
		readyForDisplay = true;
	});

	const onKeyDown = () => {
		filteredassets = [...assets];
		if (typingActive === false) {
			typingActive = true;

			setTimeout(() => {
				const currentFilterResult = [];
				for (const asset of filteredassets) {
					const stringifiedasset = JSON.stringify(asset);
					if (stringifiedasset.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
						currentFilterResult.push(asset);
					}
				}
				filteredassets = [...currentFilterResult];
				typingActive = false;
			}, 1000 * 1);
		}
	};
</script>

<p><br><br></p>
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
<div class="assets">
	{#if readyForDisplay}
		{#each filteredassets as asset, index}
			<Asset {asset} {contract} {provider} {publicWalletAddressOfVisitor}></Asset>
		{/each}
	{:else}
		... loading data from blockchain ...
	{/if}
</div>

<style>
	.assets {
		max-height: 630px;
		overflow-y: scroll;
	}
</style>
