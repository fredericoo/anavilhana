import styles from "./Search.module.scss";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import { hrefResolver } from "prismic-configuration";
import { RichText } from "prismic-reactjs";

import Text from "components/Text/Text";
import { useDocuments } from "utils/hooks/useDocuments";
import { useRouter } from "next/router";

const Search = () => {
	const [active, setActive] = useState(false);
	const documents = useDocuments().filter((doc) => doc.uid);
	const [results, setResults] = useState([]);
	const inputRef = useRef();
	const { asPath } = useRouter();
	const { t } = useTranslation();

	useEffect(() => {
		setActive(false);
	}, [asPath]);

	useEffect(() => {
		if (!active) {
			setResults([]);
		}
	}, [active]);

	useEffect(() => {
		inputRef.current && inputRef.current.focus();
	}, [active]);

	const searchInValue = (a, b) => {
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

		if (typeof a === "string") {
			return compareStrings(a, b);
		} else if (typeof a === "object") {
			return compareObjectToString(a, b);
		} else {
			return false;
		}
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

	return (
		<div className={styles.container}>
			<button
				className={styles.button}
				type="button"
				onClick={() => setActive(true)}
			>
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
			</button>
			{active && (
				<div className={styles.box}>
					<div className={styles.inputContainer}>
						<input
							transition={{ ease: "easeOut", duration: 0.3 }}
							className={styles.input}
							ref={inputRef}
							placeholder={t("common:buscaDigite")}
							type="text"
							onChange={onChange}
						/>
						{!!results.length && (
							<ul className={styles.suggestions}>
								<li className={`smcp ${styles.resultCount}`}>
									{results.length}{" "}
									{results.length === 1
										? t("common:resultados.singular")
										: t("common:resultados.plural")}
								</li>

								{results.map((result) => (
									<li key={result.uid}>
										<Link href={hrefResolver(result)}>
											<a>
												<Text
													content={
														(result.data && result.data.titulo) ||
														result.data.nome
													}
												/>
											</a>
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
					<button
						className={styles.button}
						type="button"
						onClick={() => setActive(false)}
					>
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
					</button>
				</div>
			)}
		</div>
	);
};

export default Search;
