<script>
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import Asset from './Asset.svelte';
	export let contract;
	export let publicWalletAddressOfVisitor;
	export let provider;
	export let projectID
	let searchTerm = '';

	let assets = [];
	let filteredassets = [];
	let readyForDisplay = false;
	let typingActive = false;


	onMount(async () => {
		loadData();
	});

	async function loadData() {
		let countProjects = 0;
		const projectCounter = await contract.projectCounter();
		assets = [];
		readyForDisplay = false;
		if (projectID === 0){
			while (countProjects < projectCounter) {
				countProjects++;
				await getAssetsForProjectID(countProjects)
			}
		} else {
			await getAssetsForProjectID(projectID)
		}

		filteredassets = [...assets];
		readyForDisplay = true;
	}
	async function getAssetsForProjectID(projectID) {
		const projectHashes = await contract.getProjectHashes(projectID);
			let counter = 0;
			while (counter < projectHashes.length) {
				let assetRaw = await contract.getAsset(projectHashes[counter]);
				const asset = {
					id: Number(await contract.hashToAssetID(projectHashes[counter])),
					text: assetRaw.text,
					upVoteScore: Number(ethers.formatEther(assetRaw.upVoteScore)),
					downVoteScore: Number(ethers.formatEther(assetRaw.downVoteScore)),
					reconciliationFrom: Number(assetRaw.reconciliationFrom),
					reconciled: assetRaw.reconciled
				};
				assets.push(asset);
				counter++;
			}
	}

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

	function shuffle(array) {
		let currentIndex = array.length,
			randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}
</script>

<div class="assets">
	<!-- svelte-ignore a11y-autofocus -->
	<input
		bind:value={searchTerm}
		class="myInputField"
		type="text"
		placeholder="... filter assets ..."
		on:keydown={onKeyDown}
		autofocus
	/>

	<p><br /></p>
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
