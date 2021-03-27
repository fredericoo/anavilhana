module.exports = {
	// -- Prismic API endpoint
	// Determines which repository to query and fetch data from
	// Configure your site's access point here
	apiEndpoint: "https://anavilhana.cdn.prismic.io/api/v2",
	// process.env.NEXT_PUBLIC_PRISMIC_API_ENDPOINT,
	accessToken: "",
	// process.env.NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN

	// -- Link resolution rules
	// Manages links to internal Prismic documents
	// Modify as your project grows to handle any new routes you've made
	linkResolver: function (doc) {
		if (doc.type === "filme") {
			return `/producoes/${doc.uid}`;
		}
		if (doc.type === "membro") {
			return `/membros/${doc.uid}`;
		}
		if (doc.type === "educacao") {
			return `/formacao/${doc.uid}`;
		}
		if (doc.type === "homepage") {
			return `/`;
		}
		if (doc.link_type === "Web") {
			return doc.url;
		}
		if (doc.url) {
			return doc.url;
		}
		return `/${doc.uid}`;
	},

	// Additional helper function for Next/Link component
	hrefResolver: function (doc) {
		if (doc.type === "filme") {
			return `/producoes/${doc.uid}`;
		}
		if (doc.type === "membro") {
			return `/membros/${doc.uid}`;
		}
		if (doc.type === "educacao") {
			return `/formacao/${doc.uid}`;
		}
		if (doc.type === "homepage") {
			return `/`;
		}
		if (doc.url) {
			return doc.url;
		}
		return `/${doc.uid}`;
	},
};
