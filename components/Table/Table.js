import styles from "./Table.module.scss";

import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";

import Grid from "components/Grid/Grid";
import Columns from "components/Columns/Columns";
import Button from "components/Button/Button";

import { uniqueOptions } from "./utils/objectUtils";

const Table = ({ rows, columns, filters, searchInside, perPage = 10 }) => {
	const [showRows, setShowRows] = useState(perPage);
	const [filteredRows, setFilteredRows] = useState(rows);
	const [rowFilters, setFilter] = useState({});
	const [rowSearch, setSearch] = useState("");

	const showMore = () => setShowRows(showRows + perPage);

	const handleFilter = (selFilter, current) => {
		let newFilter = rowFilters;
		newFilter[selFilter.label] = current;
		setFilter({ ...newFilter });
	};
	const clearFilters = () => {
		let newFilter = rowFilters;
		filters.forEach((filter) => (newFilter[filter.label] = ""));
		setFilter({ ...newFilter });
	};

	const handleSearch = (e) => setSearch(e.target.value.toLowerCase().trim());
	const clearSearch = () => setSearch("");

	const clearAll = () => {
		clearSearch();
		clearFilters();
	};

	useEffect(() => {
		const search = (article) =>
			!rowSearch ||
			!!searchInside.filter((col) =>
				col(article).toLowerCase().trim().match(rowSearch)
			).length;

		const compareFilter = (article, key, value) =>
			filters
				.filter((filter) => filter.label === key)
				.filter((filter) => filter.content(article) === value);

		setFilteredRows(
			rows.filter((row) => {
				const filters = Object.entries(rowFilters).filter(
					([_, value]) => value != ""
				);
				return (
					filters.map(([key, value]) => compareFilter(row, key, value)).flat()
						.length >= filters.length && search(row)
				);
			})
		);
	}, [rowFilters, rowSearch]);

	return (
		<section className={styles.section}>
			{filters && (
				<TableFilters
					rows={rows}
					filters={filters}
					rowFilters={rowFilters}
					handleFilter={handleFilter}
					rowSearch={rowSearch}
					handleSearch={handleSearch}
					clearSearch={clearSearch}
				/>
			)}
			<div className={styles.table}>
				<TableHeader columns={columns} />

				{!!filteredRows.length ? (
					<TableBody
						perPage={perPage}
						columns={columns}
						rows={filteredRows}
						limit={showRows}
						showMore={showMore}
					/>
				) : (
					<NoRows clearFunction={clearAll} />
				)}
			</div>
		</section>
	);
};

export default Table;

const TableFilters = ({
	rows = [],
	filters = [],
	rowSearch = "",
	handleSearch = () => {},
	clearSearch = () => {},
	rowFilters = {},
	handleFilter = () => {},
}) => {
	const { t } = useTranslation();
	return (
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
						value={rowSearch}
						className={styles.search}
						placeholder={t("common:buscaDigite")}
					/>
					{rowSearch && (
						<button
							type="button"
							onClick={clearSearch}
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
							value={rowFilters[filter.label]}
						>
							<option value=""></option>
							{uniqueOptions(rows, filter.content).map((option, key) => (
								<option key={key} value={option}>
									{option}
								</option>
							))}
						</select>
						{rowFilters[filter.label] && (
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
	);
};

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
			{rows.slice(0, limit).map((row, key) => (
				<TableRow key={row.uid + key} row={row} columns={columns} />
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

const TableRow = ({ row, columns }) => (
	<Grid gap={0} className={`${styles.row} s-sm`} container>
		{columns.map((col, key) => (
			<Grid.Col md={`span ${col.size || 1}`} key={key} className={styles.col}>
				<div>{col.content(row)}</div>
			</Grid.Col>
		))}
	</Grid>
);

const NoRows = ({ clearFunction }) => {
	const { t } = useTranslation();
	return (
		<Grid>
			<Grid.Col>
				<p className={styles.nada}>
					{t("common:nenhumResultado")}{" "}
					{clearFunction && (
						<>
							{t("common:tente")}{" "}
							<Button type="link" onClick={clearFunction}>
								{t("common:limparFiltros")}
							</Button>
						</>
					)}
				</p>
			</Grid.Col>
		</Grid>
	);
};
