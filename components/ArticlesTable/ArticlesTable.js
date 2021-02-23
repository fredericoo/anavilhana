import styles from "./ArticlesTable.module.scss";

import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import moment from "moment";

import Grid from "components/Grid/Grid";
import Button from "components/Button/Button";

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
					<a className={styles.link}>
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
				!!article.data.data
					? moment(article.data.data)?.format("MM/YYYY")
					: null,
		},
	];

	const searchInside = [
		(article) =>
			article.data.data ? moment(article.data.data).format("MM/YYYY") : "",
		(article) => article.data.fonte || "",
		(article) => RichText.asText(article.data.titulo) || "",
	];

	const filters = [
		{
			label: t("common:data"),
			content: (article) =>
				article.data.data ? moment(article.data.data).format("MM/YYYY") : false,
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

const TableHeader = ({ columns }) => (
	<Grid gap={0} container className={`${styles.header} s-sm`}>
		{columns.map((col, key) => (
			<Grid.Col
				sm={`span ${col.size || 1}`}
				key={key}
				className={`${styles.col} smcp`}
			>
				{col.label}
			</Grid.Col>
		))}
	</Grid>
);

const TableBody = ({ columns, rows, limit, perPage, showMore }) => {
	const { t } = useTranslation();
	return (
		<>
			{rows.slice(0, limit).map((article, key) => (
				<TableRow key={article.uid + key} article={article} columns={columns} />
			))}
			{showMore && limit < rows.length && (
				<div className={styles.showMore}>
					<Button type="link" onClick={showMore}>
						{t("common:proximaPagina")} {Math.min(perPage, rows.length - limit)}
					</Button>
				</div>
			)}
		</>
	);
};

const TableRow = ({ article, columns }) => (
	<Link href={hrefResolver(article.data.link)}>
		<a target="_blank" className={styles.link}>
			<Grid gap={0} className={`${styles.row} s-sm`} container>
				{columns.map((col, key) => (
					<Grid.Col
						md={`span ${col.size || 1}`}
						key={key}
						className={styles.col}
					>
						<div>{col.content(article)}</div>
					</Grid.Col>
				))}
			</Grid>
		</a>
	</Link>
);

const NoRows = ({ clearFilters }) => {
	const { t } = useTranslation();
	return (
		<Grid>
			<Grid.Col>
				<p className={styles.nada}>
					{t("common:nenhumResultado")}{" "}
					{clearFilters && (
						<>
							{t("common:tente")}{" "}
							<Button type="link" onClick={clearFilters}>
								{t("common:limparFiltros")}
							</Button>
						</>
					)}
				</p>
			</Grid.Col>
		</Grid>
	);
};
