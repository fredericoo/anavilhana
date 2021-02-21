import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";

// import styles from "styles/pages/filmes.module.scss";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Columns from "components/Columns/Columns";
import Grid from "components/Grid/Grid";
import CourseThumb from "components/CourseThumb/CourseThumb";
import { RichText } from "prismic-reactjs";
import Text from "components/Text/Text";

const Educacao = ({ doc, docs, config }) => {
	return (
		<Layout config={config}>
			{doc && doc.data && (
				<Meta
					pageTitle={RichText.asText(doc.data.titulo)}
					pageDesc={RichText.asText(doc.data.texto)}
				/>
			)}
			<Grid container>
				<Grid.Col sm="grid-start / grid-end">
					<h1 className={`h-1`}>
						{doc && doc.data && <Text content={doc.data.titulo} />}
					</h1>
				</Grid.Col>
				<Grid.Col sm="grid-start / grid-end">
					<div>
						<Columns sm={1} md={2} lg={3}>
							{docs &&
								docs.map((doc, key) => <CourseThumb key={key} course={doc} />)}
						</Columns>
					</div>
				</Grid.Col>
			</Grid>
		</Layout>
	);
};

export default Educacao;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("cursos", {
		lang: locale,
	});

	const documents = await client.query(
		Prismic.Predicates.at("document.type", "educacao"),
		{ fetchLinks: "membro.nome", orderings: "[my.filme.datas.inicio desc]" }
	);

	const config = await client.getSingle("config", { lang: locale });

	if (config) {
		return {
			revalidate: 60,
			props: {
				doc: doc || {},
				docs: documents.results || [],
				config: config || {},
			},
		};
	}
	return { revalidate: 60, props: { doc: {}, docs: [], config: {} } };
}
