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
import ScrollNav from "components/ScrollNav/ScrollNav";

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
				<div className={`grid grid--full`}>
					<nav className={styles.nav}>
						<ScrollNav
							items={[
								{ label: t("common:premiacoes"), id: "premiacoes" },
								{ label: t("common:fichaTecnica"), id: "fichaTecnica" },
								{ label: t("common:sinopse"), id: "sinopse" },
								{ label: t("common:galeria"), id: "galeria" },
							]}
						/>
					</nav>
					{!!filme.premiacoes.length && filme.premiacoes[0].ano && (
						<section id="premiacoes" className={styles.section}>
							<Prizes prizes={filme.premiacoes} />
						</section>
					)}
					{filme.ficha_tecnica && (
						<section id="fichaTecnica" className={styles.section}>
							<TechnicalDetails details={filme.ficha_tecnica} />
						</section>
					)}
					<section id="sinopse" className={`${styles.section} ${styles.over}`}>
						<Sinopse filme={filme} />
					</section>
					{!!filme.galeria.length && filme.galeria[0].imagem1 && (
						<section
							id="galeria"
							className={`${styles.section} ${styles.over}`}
						>
							<PhotoCarousel photos={filme.galeria} />
						</section>
					)}
				</div>
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
