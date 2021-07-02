import styles from "./Product.module.scss";

import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import useTranslation from "next-translate/useTranslation";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Grid from "components/Grid/Grid";

import Text from "components/Text/Text";
import Placeholder from "components/Placeholder/Placeholder";
import Flow from "components/Flow/Flow";
import { useRouter } from "next/router";

export default function Product({ doc, config }) {
	const { t } = useTranslation();
	const { locale } = useRouter();

	if (doc && doc.data) {
		const produto = doc.data;

		return (
			<Layout config={config} altLangs={doc.alternate_languages}>
				<Meta
					pageTitle={RichText.asText(produto.titulo)}
					pageDesc={RichText.asText(produto.sobre)}
					pageType="article"
					pageImage={
						produto.imagem
							? produto.imagem.small
								? produto.imagem.small.url
								: produto.imagem.url
							: ""
					}
				/>
				<Grid container className={styles.page}>
					{produto.imagem?.url && (
						<Grid.Col rowMd={1} md="grid-start / col-7">
							<Placeholder
								src={produto.imagem.url}
								width={produto.imagem.dimensions.width}
								height={produto.imagem.dimensions.height}
								alt={produto.imagem.alt}
							/>
						</Grid.Col>
					)}
					<Grid.Col rowMd={1} md="col-7 / grid-end">
						<Flow spacing="3rem">
							<header>
								<h1 className={"h-2"}>
									<Text asText content={produto.titulo} />
								</h1>
								<div className={`${styles.price} smcp`}>
									{Intl.NumberFormat(locale, {
										style: "currency",
										currency: "BRL",
									}).format(produto.preco)}
								</div>
							</header>

							{produto.sobre && (
								<section>
									<h2 className="smcp">{t("common:conteudo")}</h2>
									<div className="body">
										<Text content={produto.sobre} />
									</div>
								</section>
							)}
						</Flow>
					</Grid.Col>
				</Grid>
			</Layout>
		);
	}
	return (
		<Layout>
			<article className={`container ${styles.article}`}>
				<div className="body">
					<h2>Erro.</h2>
					<p>
						Esta página não pôde ser carregada. Este link pode ter sido removido
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
	const documents = await client.query(
		[Prismic.Predicates.at("document.type", "produto")],
		{ pageSize: 100 }
	);

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
	const doc = await client.getByUID("produto", params.uid, {
		lang: locale,
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
