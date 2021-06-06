import styles from "./ArticlesTable.module.scss";

import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import moment from "moment";

import Link from "next/link";
import { hrefResolver } from "prismic-configuration";

import Table from "components/Table/Table";

const ArticlesTable = ({ articles, withFilters, perPage = 10 }) => {
	const { t } = useTranslation();

	const columns = [
		{
			label: t("common:titulo"),
			size: 5,
			content: (article) => (
				<Link href={hrefResolver(article.data.link)}>
					<a className={styles.link} target="_blank">
						<h2 className={styles.title}>
							{article.data.titulo && RichText.asText(article.data.titulo)}{" "}
							<div className={`${styles.format} smcp`}>
								{article.data.link &&
									t(`common:type.${article.data.link.link_type}`)}
							</div>
						</h2>

						<div className={`${styles.lead} s-xs`}>
							<RichText render={article.data.bigode} />
						</div>
					</a>
				</Link>
			),
		},

		{
			label: t("common:tipo"),
			size: 2,
			content: (article) => article.data.tipo,
		},
		{
			label: t("common:fonte"),
			size: 3,
			content: (article) => article.data.fonte,
		},
		{
			label: t("common:data"),
			size: 2,
			content: (article) =>
				!!article.data.data ? moment(article.data.data)?.format("YYYY") : null,
		},
	];

	const searchInside = [
		(article) =>
			article.data.data ? moment(article.data.data).format("YYYY") : "",
		(article) => article.data.fonte || "",
		(article) => RichText.asText(article.data.titulo) || "",
		(article) => article.data.keywords || "",
	];

	const filters = [
		{
			label: t("common:data"),
			content: (article) =>
				article.data.data ? moment(article.data.data).format("YYYY") : false,
		},
		{
			label: t("common:tipo"),
			content: (article) => article.data.tipo,
		},
		{
			label: t("common:idioma"),
			content: (article) => article.data.idioma || false,
		},
	];

	return (
		<Table
			columns={columns}
			rows={articles}
			filters={withFilters ? filters : null}
			searchInside={searchInside}
			perPage={perPage}
		/>
	);
};

export default ArticlesTable;
