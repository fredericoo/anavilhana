import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import styles from "styles/pages/sobre.module.scss";
import Placeholder from "components/Placeholder/Placeholder";
import { RichText } from "prismic-reactjs";
import Columns from "components/Columns/Columns";
import MemberCard from "components/MemberCard/MemberCard";
import { hrefResolver } from "prismic-configuration";
import Meta from "components/Meta/Meta";

const Contato = ({ doc, config }) => {
	const contato = doc ? doc.data : null;

	return (
		<Layout config={config}>
			{contato && <Meta pageTitle={contato.titulo} />}
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

	if (sobre && config) {
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
