<script type="ts">
	import { page } from '$app/stores';
	const brand = 'Freedom Cash';
	export let title = brand;
	export let description =
		'FreedomCash Helps Those Who Help Each Other Into Freedom, Fairness, Love and Peace.';
	export let image =
		'https://github.com/monique-baumann/freedom-cash/assets/145258627/997b6ea7-3c3d-4b07-ba2a-be402e0c4317';
	export let url = `https://${$page.url.host}${$page.url.pathname}`;
	export let twitterHandle = '@monique_is_free';
</script>

<svelte:head>
	<title>{title} - {brand}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={`${title} - ${brand}`} />
	<meta property="og:site_name" content={brand} />
	<meta property="og:description" content={description} />
	<meta property="og:image" name="og:image" content={image} />
	<meta name="og:url" content={url} />
	<meta name="twitter:site" content={twitterHandle} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={`${title} - ${brand}`} />
	<meta name="twitter:description" content={description} />
</svelte:head>