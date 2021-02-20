import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import styles from "styles/pages/filmes.module.scss";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import ArticlesTable from "components/ArticlesTable/ArticlesTable";

const Imprensa = ({ articles, doc, config }) => {
	const imprensa = doc ? doc.data : null;
	return (
		<Layout config={config}>
			<div className={`grid grid--inner`}>
				{imprensa && (
					<header className={styles.header}>
						<Meta
							pageTitle={RichText.asText(imprensa.titulo)}
							pageDesc={RichText.asText(imprensa.corpo)}
						/>
						<h1 className={`h-1`}>{RichText.asText(imprensa.titulo)}</h1>
					</header>
				)}
			</div>
			<ArticlesTable withFilters articles={articles} />
		</Layout>
	);
};

export default Imprensa;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("imprensa", {
		lang: locale,
	});

	const documents = await client.query(
		Prismic.Predicates.at("document.type", "artigo"),
		{
			fetchLinks: ["filme.titulo"],
		}
	);

	const config = await client.getSingle("config", { lang: locale });

	if (doc && config) {
		return {
			revalidate: 60,
			props: {
				articles: documents.results || {},
				config: config || {},
				doc: doc || {},
			},
		};
	}
	return { revalidate: 60, props: { articles: {}, doc: {}, config: {} } };
}
