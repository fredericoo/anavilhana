import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import { RichText } from "prismic-reactjs";
import styles from "styles/pages/contato.module.scss";
import Text from "components/Text/Text";

const Contato = ({ doc, config }) => {
	const contato = doc ? doc.data : null;

	return (
		<Layout config={config}>
			{contato && <Meta pageTitle={RichText.asText(contato.titulo)} />}
			{contato && (
				<section className={`${styles.section} grid grid--inner`}>
					<header>
						<h1 className={`h-1`}>{RichText.asText(contato.titulo)}</h1>
					</header>
					<ul className={styles.ways}>
						{contato.formas.map((forma, key) => (
							<li key={key}>
								<dt>{forma.forma}</dt>
								<dd>
									<RichText render={forma.conteudo} />
								</dd>
							</li>
						))}
					</ul>
				</section>
			)}
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
