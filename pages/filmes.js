import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import styles from "styles/pages/filmes.module.scss";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Columns from "components/Columns/Columns";
import FilmThumb from "components/FilmThumb/FilmThumb";

const Filmes = ({ filmes, doc, config }) => {
	const filmesPage = doc ? doc.data : null;
	return (
		<Layout config={config}>
			<div className={`grid grid--inner`}>
				{filmesPage && (
					<header className={styles.header}>
						<Meta
							pageTitle={RichText.asText(filmesPage.titulo)}
							pageDesc={RichText.asText(filmesPage.corpo)}
						/>
						<h1 className={`h-1`}>{RichText.asText(filmesPage.titulo)}</h1>
					</header>
				)}
				<Columns sm={1} md={2} className={styles.films}>
					{filmes.results &&
						filmes.results.map((filme, key) => (
							<FilmThumb key={filme.uid + key} obra={filme} />
						))}
				</Columns>
			</div>
		</Layout>
	);
};

export default Filmes;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("filmes", {
		lang: locale,
	});

	const documents = await client.query(
		Prismic.Predicates.at("document.type", "filme"),
		{ fetchLinks: "membro.nome", orderings: "[my.filme.lancamento desc]" }
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
