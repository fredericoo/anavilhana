import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Columns from "components/Columns/Columns";
import Grid from "components/Grid/Grid";
import { RichText } from "prismic-reactjs";
import Text from "components/Text/Text";
import PageHeader from "components/PageHeader/PageHeader";

const Loja = ({ doc, docs, config }) => {
	return (
		<Layout config={config}>
			<Grid container>
				<Grid.Col sm="grid-start / grid-end">
					{doc?.data && (
						<PageHeader>
							<Meta
								pageTitle={RichText.asText(doc.data.titulo)}
								pageDesc={RichText.asText(doc.data.texto)}
							/>
							<h1 className={`h-1 visually-hidden`}>
								<Text asText content={doc.data.titulo} />
							</h1>
						</PageHeader>
					)}
				</Grid.Col>
				<Grid.Col sm="grid-start / grid-end">
					<div>
						<Columns sm={1} md={2} lg={3}>
							{docs && docs.map((doc, key) => <div>{doc.uid}</div>)}
						</Columns>
					</div>
				</Grid.Col>
			</Grid>
		</Layout>
	);
};

export default Loja;

export async function getStaticProps({ locale }) {
	const client = Client();
	const doc = await client.getSingle("loja", {
		lang: locale,
	});

	const documents = await client.query(
		Prismic.Predicates.at("document.type", "produto"),
		{
			pageSize: 100,
		}
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
