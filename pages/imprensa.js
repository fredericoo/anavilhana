import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import { RichText } from "prismic-reactjs";

const Imprensa = ({ doc, config }) => {
	const imprensa = doc ? doc.data : null;

	return (
		<Layout config={config}>
			{imprensa && <Meta pageTitle={RichText.asText(imprensa.titulo)} />}
		</Layout>
	);
};

export default Imprensa;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("imprensa", {
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
