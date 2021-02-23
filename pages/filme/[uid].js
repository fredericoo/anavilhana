import styles from "./Filme.module.scss";

import { Client, groupHasItems } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import useTranslation from "next-translate/useTranslation";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Prizes from "components/Prizes/Prizes";
import TechnicalDetails from "components/TechnicalDetails/TechnicalDetails";
import Sinopse from "components/Sinopse/Sinopse";
import PhotoCarousel from "components/PhotoCarousel/PhotoCarousel";
import ScrollNav from "components/ScrollNav/ScrollNav";
import Columns from "components/Columns/Columns";
import WatchLink from "components/WatchLink/WatchLink";
import Table from "components/Table/Table";

import Grid from "components/Grid/Grid";
import ArticlesTable from "components/ArticlesTable/ArticlesTable";

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

				<Sinopse filme={filme} />

				{groupHasItems(filme.plataforma_e_link) &&
					!!filme.plataforma_e_link[0].nome_da_plataforma && (
						<Grid className={styles.section}>
							<Grid.Col>
								<h2 className={`h-4 ${styles.heading}`}>
									{t("common:assista")}
								</h2>
								<Columns sm={1} md={3} lg={3} xl={4}>
									{filme.plataforma_e_link.map((assista, key) => (
										<WatchLink
											key={key}
											platform={assista.nome_da_plataforma}
											link={assista.link_do_filme}
										/>
									))}
								</Columns>
							</Grid.Col>
						</Grid>
					)}

				<div className={`grid grid--full`}>
					<nav className={styles.nav}>
						<ScrollNav
							items={[
								{ label: t("common:premiacoes"), id: "premiacoes" },
								{ label: t("common:exibicoes"), id: "exibicoes" },
								{ label: t("common:fichaTecnica"), id: "fichaTecnica" },
								{ label: t("common:galeria"), id: "galeria" },
								{ label: t("common:criticas"), id: "criticas" },
							]}
						/>
					</nav>

					{groupHasItems(filme.premiacoes) && (
						<section
							id="premiacoes"
							className={`${styles.section}`}
							style={{ "--section__bg": "var(--colour__secondary)" }}
						>
							<Prizes prizes={filme.premiacoes} perPage={3} />
						</section>
					)}

					{groupHasItems(filme.aired) && (
						<section
							id="exibicoes"
							className={`${styles.section}`}
							style={{ "--section__bg": "var(--colour__secondary)" }}
						>
							<Grid>
								<Grid.Col lg="col-4 / grid-end">
									<Table
										rows={filme.aired}
										columns={[
											{
												label: t("common:ano"),
												content: (row) => row.aired_ano,
												size: 3,
											},
											{
												label: "",
												content: (row) => (
													<>
														{row.aired_titulo && (
															<RichText render={row.aired_titulo} />
														)}
														{row.aired_sobre && (
															<div className="l-2">
																<RichText render={row.aired_sobre} />
															</div>
														)}
													</>
												),
												size: 9,
											},
										]}
										perPage={3}
									/>
								</Grid.Col>
							</Grid>
						</section>
					)}

					{groupHasItems(filme.ficha_tecnica) && (
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

					{groupHasItems(filme.galeria) && (
						<section data-hidenav id="galeria" className={`${styles.section}`}>
							<PhotoCarousel photos={filme.galeria} />
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
							<ArticlesTable articles={articles} perPage={3} />
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
	const client = Client();
	const documents = await client.query([
		Prismic.Predicates.at("document.type", "filme"),
	]);

	return {
		paths: documents.results.map((doc) => {
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
