<script>
	import Seo from '$lib/components/Seo.svelte';
	import { ethers } from 'ethers';
	import hashJs from 'hash.js';
	import { onMount } from 'svelte';
	import {
		freedomBets,
		freedomBetsABI,
		targetChainId,
		targetChainName,
		votingPeriodMinLength
	} from '../../constants.ts';
	import FeedbackToVisitor from '../../lib/components/FeedbackToVisitor.svelte';
	import { connectToBlockchain, replaceContentToShowClickableLinks } from '$lib/helpers.js';

	let publicWalletAddressOfVisitor = '';
	let visitorIsConnectedViaBrowserWallet = false;
	let visitorHasBrowserWallet = false;
	let chainId = '';
	let contract;
	let accounts;
	let newProject = '';
	let newAsset = '';
	let message = '';
	let detailsFor = 0;
	let visitorInformed = true;
	let projectsLoaded = false;
	let projects = [];
	let provider;
	let buttonText = `Connect To ${targetChainName}`;

	onMount(async () => {
		if (typeof window.ethereum === 'undefined') {
			visitorHasBrowserWallet = false;
		} else {
			visitorHasBrowserWallet = true;
			const connectionData = await connectToBlockchain();
			provider = connectionData.provider;
			contract = connectionData.fBContract;
			publicWalletAddressOfVisitor = connectionData.publicWalletAddressOfVisitor;
			visitorIsConnectedViaBrowserWallet = true;
			await loadProjects()
		}
	});

	async function addProject() {
		const counter = await contract.projectCounter();
		const projectID = counter + BigInt(1);
		console.log(`adding project ${projectID} ${newProject}`);
		await contract.addProject(projectID, newProject);
		message = `Your project ${newProject} will be added with projectID ${projectID}. `;
		visitorInformed = false;
		newProject = '';
	}
	async function addAsset(projectID) {
		// const hash = "0x" + hashJs.sha256().update(newAsset).digest('hex')
		const hash = await contract.getHash(newAsset)
		console.log(`adding to ${projectID} asset ${newAsset} ${hash} ${votingPeriodMinLength}`);
		await contract.addAsset(projectID, newAsset, hash, votingPeriodMinLength);
	}
	async function loadProjects() {
		if (visitorInformed) {
			projectsLoaded = false;
			projects = [];
		}
		const projectCounter = await contract.projectCounter();
		let counter = 0;
		while (counter < projectCounter) {
			counter++;
			projects.push(await contract.projects(counter));
		}
		projectsLoaded = true;
	}
</script>

<div class="text-center">
	<p><br></p>
	Freedom Projects incentivize voters to vote and protect against stupidity, corruption and fraud.
	<p><br /></p>
	Any project can become a community guarded project via Freedom Bets.
	<!-- <p><br></p>
	There is no
	<a href="https://otherparty.co.uk" target="_blank">real democracy</a> without freedom of speech.
	<p><br /></p>
	This is why we leverage the blockchain technology to ensure we can speak freely. -->
	<div class="projects content">
		{#if projectsLoaded}
			<p><br /><br /></p>
			<table>
				<tr>
					<th>ID</th>
					<th>URL</th>
				</tr>

				{#each projects as project, index}
					<tr>
						<td
							on:click={() => {
								detailsFor == 0 ? (detailsFor = index + 1) : (detailsFor = 0);
							}}
						>
							{index + 1}
						</td>
						<td>
							{@html replaceContentToShowClickableLinks(project)}
						</td>
					</tr>

					{#if detailsFor == index + 1}
						<tr>
							<td colspan="2">
								<input
									bind:value={newAsset}
									class="myInputField"
									type="text"
									placeholder="... add new asset ..."
								/>
								<p><br /></p>
								{#if newAsset}
									<button class="inside" on:click={() => addAsset(index + 1)}>Add Asset</button>
								{/if}
							</td>
						</tr>
					{/if}
				{/each}
			</table>
		{/if}
		<p><br /><br /></p>
		{#if visitorInformed}
			<input
				bind:value={newProject}
				class="myInputField"
				type="text"
				placeholder="... add new project URL ..."
			/>
			<p><br /></p>
			{#if newProject}
				<button class="inside" on:click={() => addProject()}>Add Project</button>
			{/if}
		{:else}
			<FeedbackToVisitor
				smartContractAddress={freedomBets}
				{message}
				on:clickedOK={() => {
					visitorInformed = true;
				}}
			></FeedbackToVisitor>
		{/if}
		<p><br /><br /><br /></p>
	</div>

	<p><br /><br /></p>
	<div class="center">
		<img
			class="moniqueImage"
			src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/7a58cce2-5e01-4e2a-b004-2623819d396f"
			alt="tea"
		/>
	</div>
	<p><br /></p>

	If we do not own freedom, we might own nothing at all.
	<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
	<p><br /></p>
</div>

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
	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}

	td,
	th {
		border: 1px solid #dddddd;
		text-align: center;
		padding: 8px;
	}
	tr:nth-child(even) {
		background-color: #dddddd;
	}
	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}

</style>
