import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import { RichText } from "prismic-reactjs";

const Contato = ({ doc, config }) => {
	const contato = doc ? doc.data : null;

	return (
		<Layout config={config}>
			{contato && <Meta pageTitle={RichText.asText(contato.titulo)} />}
		</Layout>
	);
};

export default Contato;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("contato", {
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
