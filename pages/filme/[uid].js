import { queryRepeatableDocuments } from "utils/queries";
import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import styles from "./Filme.module.scss";
import Meta from "components/Meta/Meta";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import FilmHero from "components/FilmHero/FilmHero";
import Prizes from "components/Prizes/Prizes";
import TechnicalDetails from "components/TechnicalDetails/TechnicalDetails";
import Sinopse from "components/Sinopse/Sinopse";
import PhotoCarousel from "components/PhotoCarousel/PhotoCarousel";

export default function Post({ doc, config }) {
	const { t } = useTranslation();

	if (doc && doc.data) {
		const filme = doc.data;

		return (
			<Layout config={config} altLangs={doc.alternate_languages}>
				<Meta
					pageTitle={RichText.asText(filme.titulo)}
					pageDesc={RichText.asText(filme.sinopse)}
					pageType="article"
					pageImage={
						filme.imagem
							? filme.imagem.small
								? filme.imagem.small.url
								: filme.imagem.url
							: ""
					}
				/>
				<FilmHero filmes={[doc]} />
				{filme.premiacoes && <Prizes prizes={filme.premiacoes} />}
				{filme.ficha_tecnica && (
					<TechnicalDetails details={filme.ficha_tecnica} />
				)}
				<Sinopse filme={filme} />
				{filme.galeria && <PhotoCarousel photos={filme.galeria} />}
			</Layout>
		);
	}
	return (
		<Layout>
			<article className={`container ${styles.article}`}>
				<div className="body">
					<h2>Erro.</h2>
					<p>
						Este filme não pôde ser carregado. Este link pode ter sido removido
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
		(doc) => doc.type === "filme"
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
	const doc = await client.getByUID("filme", params.uid, {
		lang: locale,
		fetchLinks: ["membro.nome"],
	});
	const config = await client.getSingle("config", { lang: locale });

	if (doc) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				doc: doc || {},
			},
		};
	}
	return { revalidate: 60, props: { doc: {}, config: {} } };
}
