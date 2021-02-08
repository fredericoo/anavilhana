import { queryRepeatableDocuments } from "utils/queries";
import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import styles from "./Membro.module.scss";
import Meta from "components/Meta/Meta";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import MemberDetails from "components/MemberDetails/MemberDetails";

export default function Post({ doc, config, obras }) {
	const { t } = useTranslation();

	if (doc && doc.data) {
		const membro = doc.data;
		return (
			<Layout config={config} altLangs={doc.alternate_languages}>
				<Meta
					pageTitle={RichText.asText(membro.nome)}
					pageDesc={RichText.asText(membro.sobre)}
					pageType="article"
					pageImage={
						membro.imagem
							? membro.imagem.small
								? membro.imagem.small.url
								: membro.imagem.url
							: ""
					}
				/>
				<MemberDetails member={membro} obras={obras} />
			</Layout>
		);
	}
	return (
		<Layout>
			<article className={`container ${styles.article}`}>
				<div className="body">
					<h2>Erro.</h2>
					<p>
						Este membro não pôde ser carregado. Este link pode ter sido removido
						ou expirado. Se você acredita que este é um erro, por favor entre em
						contato com nossa equipe.
					</p>
				</div>
			</article>
		</Layout>
	);
}

export async function getStaticPaths() {
	const documents = await queryRepeatableDocuments(
		(doc) => doc.type === "membro"
	);

	return {
		paths: documents.map((doc) => {
			return {
				params: { uid: doc.uid },
				locale: doc.lang,
			};
		}),
		fallback: true,
	};
}

export async function getStaticProps({ params, locale }) {
	const client = Client();
	const doc = await client.getByUID("membro", params.uid, {
		lang: locale,
		fetchLinks: ["filme.titulo"],
	});
	const allObras = await queryRepeatableDocuments(
		(doc) => doc.type === "filme"
	);
	const obras = allObras.filter(
		(obra) =>
			obra.data.ficha_tecnica.filter((item) => item.membro.uid === doc.uid)
				.length > 0
	);

	const config = await client.getSingle("config", { lang: locale });

	if (doc) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				doc: doc || {},
				obras: obras || {},
			},
		};
	}
	return { revalidate: 60, props: { doc: {}, config: {}, obras: {} } };
}
