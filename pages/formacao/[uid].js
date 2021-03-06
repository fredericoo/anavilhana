import styles from "./Educacao.module.scss";

import { Client, groupHasItems } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import { RichText } from "prismic-reactjs";

import useTranslation from "next-translate/useTranslation";
import { formatDateRange } from "components/CourseThumb/utils/dateUtils";

import Link from "next/link";
import { hrefResolver } from "prismic-configuration";

import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import Grid from "components/Grid/Grid";
import Columns from "components/Columns/Columns";
import DownloadCard from "components/DownloadCard/DownloadCard";
import Text from "components/Text/Text";
import Placeholder from "components/Placeholder/Placeholder";
import Flow from "components/Flow/Flow";

const Membro = ({ membro }) => {
	return (
		<>
			<h3 className="h-3">
				{membro.membro && membro.membro.uid ? (
					<Link href={hrefResolver(membro.membro)}>
						<a>
							{membro.nome ? (
								membro.nome
							) : membro.membro.data ? (
								<Text asText content={membro.membro.data.nome} />
							) : (
								membro.membro.uid
							)}
						</a>
					</Link>
				) : (
					membro.nome
				)}
			</h3>
			{membro.biografia && (
				<div className="l-2 s-sm">
					<Text content={membro.biografia} />
				</div>
			)}
		</>
	);
};

export default function Educacao({ doc, config }) {
	const { t } = useTranslation();

	if (doc && doc.data) {
		const curso = doc.data;

		return (
			<Layout config={config} altLangs={doc.alternate_languages}>
				<Meta
					pageTitle={RichText.asText(curso.titulo)}
					pageDesc={RichText.asText(curso.texto)}
					pageType="article"
					pageImage={
						curso.imagem
							? curso.imagem.small
								? curso.imagem.small.url
								: curso.imagem.url
							: ""
					}
				/>
				<Grid container className={styles.page}>
					{curso.imagem?.url && (
						<Grid.Col rowMd={1} md="col-7 / grid-end">
							<Placeholder
								src={curso.imagem.url}
								width={curso.imagem.dimensions.width}
								height={curso.imagem.dimensions.height}
								alt={curso.imagem.alt}
							/>
						</Grid.Col>
					)}
					<Grid.Col rowMd={1} md="grid-start / col-7">
						<Flow spacing="3rem">
							<header>
								<div className={`${styles.type} smcp`}>
									<Text content={curso.tipo} />
								</div>
								<h1 className={"h-2"}>
									<Text asText content={curso.titulo} />
								</h1>
							</header>

							{groupHasItems(curso.datas) && (
								<section>
									<h2 className="smcp">{t("common:quando")}</h2>
									<ul>
										{curso.datas.map((range, key) => (
											<li key={key} className="h-3">
												{formatDateRange(range.inicio, range.final, [
													(date) => date.format("[de] YYYY"),
													(date) => date.format("[de] MMMM"),
													(date) => date.format("DD"),
												])}
											</li>
										))}
									</ul>
									<ul>
										{curso.datas.map((range, key) => (
											<li key={key} className="s-sm l-2">
												{formatDateRange(range.inicio, range.final, [
													(date) => date.format("HH:mm"),
												])}
											</li>
										))}
									</ul>
								</section>
							)}
							{groupHasItems(curso.ministrado) && (
								<section>
									<h2 className="smcp">{t("common:ministrado")}</h2>
									<ul className={styles.teachers}>
										{curso.ministrado.map((professor, key) => (
											<li key={key}>
												<Membro membro={professor} />
											</li>
										))}
									</ul>
								</section>
							)}
							{curso.preco && (
								<div className={styles.price}>
									<h2 className="smcp">{t("common:investimento")}</h2>
									<div className={`h-3`}>{curso.preco}</div>
									{curso.condicoes && (
										<div className={`s-xs l-2`}>
											<Text content={curso.condicoes} />
										</div>
									)}
								</div>
							)}
							{curso.texto && (
								<section>
									<h2 className="smcp">{t("common:conteudo")}</h2>
									<div className="body">
										<Text content={curso.texto} />
									</div>
								</section>
							)}
							{groupHasItems(curso.downloads) &&
								curso.downloads[0].download_link.url && (
									<section>
										<h2 className="smcp visually-hidden">
											{t("common:links")}
										</h2>

										<Columns sm="1" md="2">
											{curso.downloads.map((download, key) => (
												<DownloadCard
													key={key}
													title={download.download_titulo}
													subtitle={
														download.download_privado ? t("common:privado") : ""
													}
													link={download.download_link}
												/>
											))}
										</Columns>
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
		[Prismic.Predicates.at("document.type", "educacao")],
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
	const doc = await client.getByUID("educacao", params.uid, {
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
