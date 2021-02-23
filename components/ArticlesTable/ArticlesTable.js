import styles from "./ArticlesTable.module.scss";

import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import moment from "moment";

import Grid from "components/Grid/Grid";
import Columns from "components/Columns/Columns";
import Button from "components/Button/Button";

import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import { uniqueOptions } from "./utils/objectUtils";

const ArticlesTable = ({ articles, withFilters, perPage = 10 }) => {
	const { t } = useTranslation();

	const [showArticles, setShowArticles] = useState(perPage);
	const [filteredArticles, setFilteredArticles] = useState(articles);
	const [articleFilters, setFilter] = useState({});

	const showMore = () => setShowArticles(showArticles + perPage);

	const columns = [
		{
			label: t("common:titulo"),
			size: 5,
			content: (article) => (
				<>
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
				</>
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

	const handleFilter = (selFilter, current) => {
		let newFilter = articleFilters;
		newFilter[selFilter.label] = current;
		setFilter({ ...newFilter });
	};

	const searchInside = [
		{
			label: t("common:data"),
			content: (article) =>
				article.data.data ? moment(article.data.data).format("MM/YYYY") : "",
		},
		{
			label: t("common:fonte"),
			content: (article) => article.data.fonte || "",
		},
		{
			label: t("common:titulo"),
			content: (article) => RichText.asText(article.data.titulo) || "",
		},
	];

	const [articleSearch, setSearch] = useState("");
	const handleSearch = (e) => setSearch(e.target.value.toLowerCase().trim());
	const clearFilters = () => {
		setSearch("");
		let newFilter = articleFilters;
		filters.forEach((filter) => (newFilter[filter.label] = ""));
		setFilter({ ...newFilter });
	};

	useEffect(() => {
		const search = (article) =>
			!articleSearch ||
			!!searchInside.filter((col) =>
				col.content(article).toLowerCase().trim().match(articleSearch)
			).length;

		const compareFilter = (article, key, value) =>
			filters
				.filter((filter) => filter.label === key)
				.filter((filter) => filter.content(article) === value);

		setFilteredArticles(
			articles.filter((article) => {
				const filters = Object.entries(articleFilters).filter(
					([_, value]) => value != ""
				);
				return (
					filters
						.map(([key, value]) => compareFilter(article, key, value))
						.flat().length >= filters.length && search(article)
				);
			})
		);
	}, [articleFilters, articleSearch]);

	return (
		<section className={styles.section}>
			{withFilters && filters && (
				<Columns sm={2} md={4} className={`container ${styles.filters}`}>
					<div className={`${styles.filter}`}>
						<label htmlFor={`search`} className={`smcp`}>
							{t("common:busca")}
						</label>
						<div className={styles.search}>
							<input
								type="text"
								onChange={handleSearch}
								name="search"
								value={articleSearch}
								className={styles.search}
								placeholder={t("common:buscaDigite")}
							/>
							{articleSearch && (
								<button
									type="button"
									onClick={() => setSearch("")}
									className={styles.clear}
								>
									×
								</button>
							)}
						</div>
					</div>
					{filters.map((filter, key) => (
						<div key={key} className={styles.filter}>
							<label htmlFor={`filter-${key}`} className={`smcp`}>
								{filter.label}
							</label>
							<div className={styles.combo}>
								<select
									onChange={(e) => handleFilter(filter, e.target.value)}
									name={`filter-${key}`}
									value={articleFilters[filter.label]}
								>
									<option value=""></option>
									{uniqueOptions(articles, filter.content).map(
										(option, key) => (
											<option key={key} value={option}>
												{option}
											</option>
										)
									)}
								</select>
								{articleFilters[filter.label] && (
									<button
										type="button"
										onClick={() => handleFilter(filter, "")}
										className={styles.clear}
									>
										×
									</button>
								)}
							</div>
						</div>
					))}
				</Columns>
			)}
			<div className={styles.table}>
				<TableHeader columns={columns} />

				{!!filteredArticles.length ? (
					<TableBody
						columns={columns}
						rows={filteredArticles}
						limit={showArticles}
						showMore={showMore}
					/>
				) : (
					<NoRows clearFilters={clearFilters} />
				)}
			</div>
		</section>
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

const TableBody = ({ columns, rows, limit, showMore }) => (
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
