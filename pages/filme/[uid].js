import styles from "./Filme.module.scss";

import { queryRepeatableDocuments } from "utils/queries";
import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import useTranslation from "next-translate/useTranslation";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import FilmHero from "components/FilmHero/FilmHero";
import Prizes from "components/Prizes/Prizes";
import TechnicalDetails from "components/TechnicalDetails/TechnicalDetails";
import Sinopse from "components/Sinopse/Sinopse";
import PhotoCarousel from "components/PhotoCarousel/PhotoCarousel";
import ScrollNav from "components/ScrollNav/ScrollNav";
import Columns from "components/Columns/Columns";
import WatchLink from "components/WatchLink/WatchLink";
import CriticsSection from "components/CriticsSection/CriticsSection";

export default function Post({ doc, articles, config }) {
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
								{ label: t("common:sinopse"), id: "sinopse" },
								{ label: t("common:galeria"), id: "galeria" },
								{ label: t("common:fichaTecnica"), id: "fichaTecnica" },
								{ label: t("common:criticas"), id: "criticas" },
								{ label: t("common:assista"), id: "assista" },
							]}
						/>
					</nav>
					{!!filme.premiacoes.length && filme.premiacoes[0].premio_titulo && (
						<section
							id="premiacoes"
							className={`${styles.section}`}
							style={{ "--section__bg": "var(--colour__secondary)" }}
						>
							<Prizes prizes={filme.premiacoes} />
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
					{filme.ficha_tecnica && (
						<section
							id="fichaTecnica"
							className={`${styles.section} ${styles.content}`}
						>
							<h2 className={`h-2 ${styles.heading}`}>
								{t("common:fichaTecnica")}
							</h2>
							<TechnicalDetails details={filme.ficha_tecnica} />
						</section>
					)}

					{!!articles.length && (
						<section
							id="criticas"
							className={`${styles.section} ${styles.content}`}
						>
							<h2 className={`h-2 ${styles.heading}`}>
								{t("common:criticas")}
							</h2>
							<CriticsSection articles={articles} />
						</section>
					)}

					{!!filme.plataforma_e_link.length &&
						filme.plataforma_e_link[0].nome_da_plataforma && (
							<section
								id="assista"
								className={`${styles.section} ${styles.content}`}
							>
								<h2 className={`h-2 ${styles.heading}`}>
									{t("common:assista")}
								</h2>
								<Columns sm={1} md={2} lg={3}>
									{filme.plataforma_e_link.map((assista, key) => (
										<WatchLink
											key={key}
											platform={assista.nome_da_plataforma}
											link={assista.link_do_filme}
										/>
									))}
								</Columns>
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
	const articles = await client.query([
		Prismic.Predicates.at("document.type", "artigo"),
		Prismic.Predicates.at("my.artigo.linked", doc.id),
	]);
	const config = await client.getSingle("config", { lang: locale });

	if (doc) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				articles: articles.results || [],
				doc: doc || {},
			},
		};
	}
	return { revalidate: 60, props: { doc: {}, config: {}, articles: [] } };
}
