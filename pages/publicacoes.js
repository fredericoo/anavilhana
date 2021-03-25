import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import ArticlesTable from "components/ArticlesTable/ArticlesTable";
import Grid from "components/Grid/Grid";
import PageHeader from "components/PageHeader/PageHeader";

const Imprensa = ({ articles, doc, config }) => {
	const imprensa = doc ? doc.data : null;
	return (
		<Layout config={config}>
			<Grid>
				{imprensa && (
					<Grid.Col>
						<PageHeader>
							<Meta
								pageTitle={RichText.asText(imprensa.titulo)}
								pageDesc={RichText.asText(imprensa.corpo)}
							/>
							<h1 className={`h-1 visually-hidden`}>
								{RichText.asText(imprensa.titulo)}
							</h1>
						</PageHeader>
					</Grid.Col>
				)}
			</Grid>
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
