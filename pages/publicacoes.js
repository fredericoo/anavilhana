import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import styles from "styles/pages/filmes.module.scss";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Columns from "components/Columns/Columns";
import ArticleThumb from "components/ArticleThumb/ArticleThumb";

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
				<Columns sm={1} md={2} lg={3} className={styles.films}>
					{articles.results &&
						articles.results.map((article, key) => (
							<ArticleThumb key={article.uid + key} article={article} />
						))}
				</Columns>
			</div>
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
		Prismic.Predicates.at("document.type", "artigo")
	);

	const config = await client.getSingle("config", { lang: locale });

	if (doc && config) {
		return {
			revalidate: 60,
			props: {
				articles: documents || {},
				config: config || {},
				doc: doc || {},
			},
		};
	}
	return { revalidate: 60, props: { articles: {}, doc: {}, config: {} } };
}
