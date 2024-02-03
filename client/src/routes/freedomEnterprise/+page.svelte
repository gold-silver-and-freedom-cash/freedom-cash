<script>
	import Seo from '$lib/components/Seo.svelte';

	const workItem1 = {
		type: "task"
	}
	const workItem2 = {
		type: "solutionProposal",
		text: "",
		link: ""
	}
</script>

<Seo title="Freedom Enterprise" />

<div class="text-center">
	<h2>Freedom Enterprise</h2>

	Will be released on March 2024.

	<div class="center">
		<img class="moniqueImage" src="https://github.com/monique-baumann/FreedomEnterprise/assets/145258627/1804d7a1-504e-47b2-a058-4207c265f23a" alt="" />
	</div>

	<p><br></p>
	We exclude corrupt entities by collaborating peer to peer.
	<a href="https://github.com/monique-baumann" target="_blank"><i>Monique Baumann</i></a>
	<p><br /></p>
</div>

<style>
	.moniqueImage {
		width: 450px;
		border-radius: 9%;
	}
</style>
