import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import styles from "styles/pages/filmes.module.scss";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import CommercialThumb from "components/CommercialThumb/CommercialThumb";
import Grid from "components/Grid/Grid";
import PageHeader from "components/PageHeader/PageHeader";

const Filmes = ({ filmes, doc, config }) => {
	const filmesPage = doc ? doc.data : null;
	return (
		<Layout config={config}>
			<Grid>
				<Grid.Col>
					{filmesPage && (
						<PageHeader>
							<Meta
								pageTitle={RichText.asText(filmesPage.titulo)}
								pageDesc={RichText.asText(filmesPage.corpo)}
							/>
							<h1 className={`h-1 visually-hidden`}>
								{RichText.asText(filmesPage.titulo)}
							</h1>
						</PageHeader>
					)}
					<div className={styles.films}>
						{filmes.results &&
							filmes.results.map((filme, key) => (
								<CommercialThumb key={filme.uid + key} obra={filme} />
							))}
					</div>
				</Grid.Col>
			</Grid>
		</Layout>
	);
};

export default Filmes;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("institucional", {
		lang: locale,
	});

	const documents = await client.query(
		Prismic.Predicates.at("document.type", "commercial"),
		{ orderings: "[my.commercial.data desc]", pageSize: 100 }
	);

	const config = await client.getSingle("config", { lang: locale });

	if (doc && config) {
		return {
			revalidate: 60,
			props: {
				filmes: documents || {},
				config: config || {},
				doc: doc || {},
			},
		};
	}
	return { revalidate: 60, props: { filmes: {}, doc: {}, config: {} } };
}
