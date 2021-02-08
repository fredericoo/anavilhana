import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import { RichText } from "prismic-reactjs";

const Filmes = ({ doc, config }) => {
	const filmes = doc ? doc.data : null;

	return (
		<Layout config={config}>
			{filmes && (
				<Meta
					pageTitle={RichText.asText(filmes.titulo)}
					pageDesc={RichText.asText(filmes.corpo)}
				/>
			)}
		</Layout>
	);
};

export default Filmes;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("filmes", {
		lang: locale,
	});
	const config = await client.getSingle("config", { lang: locale });

	if (doc && config) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				doc: doc || {},
			},
		};
	}
	return { revalidate: 600, props: { doc: {}, config: {} } };
}
