import styles from "./ArticlesTable.module.scss";
import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import moment from "moment";
import Grid from "components/Grid/Grid";
import Columns from "components/Columns/Columns";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";

const ArticlesTable = ({ articles }) => {
	const [filteredArticles, setFilteredArticles] = useState(articles);
	const { t } = useTranslation();

	const columns = [
		{
			label: t("common:data"),
			size: 2,
			content: (article) =>
				!!article.data.data
					? moment(article.data.data)?.format("MM/YYYY")
					: null,
		},
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
	];

	// utility to populate selects with unique options from the article list
	const uniqueOptions = (callback) =>
		Array.from(new Set(articles.map(callback))).filter((item) => !!item.length);

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
	const [articleFilters, setFilter] = useState({});
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
			{filters && (
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
									defaultValue=""
								>
									<option value=""></option>
									{uniqueOptions(filter.content).map((option, key) => (
										<option key={key} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>
					))}
				</Columns>
			)}
			<div className={styles.table}>
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

				{articles &&
					filteredArticles.map((article, key) => (
						<TableRow
							key={article.uid + key}
							article={article}
							columns={columns}
						/>
					))}
			</div>
		</section>
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

export default ArticlesTable;
