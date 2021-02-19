import styles from "./Search.module.scss";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { hrefResolver } from "prismic-configuration";
import { RichText } from "prismic-reactjs";

import Text from "components/Text/Text";

const Search = () => {
	const [active, setActive] = useState(false);
	const [documents, setDocuments] = useState([]);
	const [results, setResults] = useState([]);
	const inputRef = useRef();
	const { asPath } = useRouter();
	const { t } = useTranslation();

	useEffect(() => {
		fetch("/api/documents")
			.then((res) => res.json())
			.then((docs) => setDocuments(docs));
	}, [active]);

	useEffect(() => {
		setResults([]);
		if (inputRef.current) inputRef.current.value = "";
	}, [asPath]);

	useEffect(() => {
		inputRef.current && inputRef.current.focus();
	}, [inputRef.current]);

	const searchInValue = (a, b) => {
		if (typeof a === "string") {
			return compareStrings(a, b);
		} else if (typeof a === "object") {
			return compareObjectToString(a, b);
		} else {
			return false;
		}
	};
	const compareStrings = (a, b) =>
		a.toString().toLowerCase().includes(b.toString().toLowerCase().trim());

	const compareObjectToString = (a, b) => {
		if (!a || !b) return false;
		if (Array.isArray(a)) {
			if (a.length === 0) return false;
			if (a.length === 1) return compareStrings(a[0], b);
		}
		if (a.type && typeof a.spans !== "undefined") {
			return compareStrings(RichText.asText([a]), b);
		}
		return (
			Object.values(a).filter((value) => searchInValue(value, b)).length > 0
		);
	};

	const onChange = (e) => {
		if (e.target.value.length < 3) return setResults([]);
		setResults(
			documents.filter(
				(doc) =>
					Object.values(doc).filter((value) => {
						return searchInValue(value, e.target.value);
					}).length > 0
			)
		);
	};
	const onClick = () => {
		setActive(!active);
	};

	return (
		<div className={styles.container}>
			<button className={styles.button} type="button" onClick={onClick}>
				{active ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						strokeLinecap="butt"
						strokeLinejoin="arcs"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
						strokeLinecap="butt"
						strokeLinejoin="arcs"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				)}
			</button>
			{active && (
				<div className={styles.box}>
					<input
						transition={{ ease: "easeOut", duration: 0.3 }}
						className={styles.input}
						ref={inputRef}
						placeholder={t("common:busca")}
						type="text"
						onChange={onChange}
					/>
					<ul className={styles.suggestions}>
						{!!results.length && (
							<li className={`smcp ${styles.resultCount}`}>
								{results.length}{" "}
								{results.length === 1
									? t("common:resultados.singular")
									: t("common:resultados.plural")}
							</li>
						)}
						{results.map((result) => (
							<li key={result.uid}>
								<Link href={hrefResolver(result)}>
									<a>
										<Text
											content={
												(result.data && result.data.titulo) || result.data.nome
											}
										/>
									</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Search;
