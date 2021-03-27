import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import useTranslation from "next-translate/useTranslation";
import Button from "components/Button/Button";
import { useRouter } from "next/router";
import { hrefResolver } from "prismic-configuration";
import Search from "components/Search/Search";

const Navbar = ({ menu }) => {
	const { asPath, locales, locale } = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);
	const { t } = useTranslation();

	useEffect(() => {
		setIsOpen(false);
	}, [asPath]);

	return (
		<nav className={`container ${styles.navbar}`}>
			<Link href="/">
				<a className={styles.logo}>
					<img src="/img/logo.svg" />
				</a>
			</Link>
			<div className={styles.viewport}>
				<div className={`${styles.tools} ${isOpen ? styles.open : ""}`}>
					<ul className={styles.menu}>
						{menu &&
							menu.map(({ opcao, link }) => (
								<li key={opcao}>
									<Link href={hrefResolver(link)}>
										<a
											className={` ${styles.item} ${
												asPath === hrefResolver(link) ? styles.active : ""
											}`}
										>
											{opcao}
										</a>
									</Link>
								</li>
							))}
					</ul>
					<Search />
				</div>
			</div>
			<button
				label={t("common:toggleMenu")}
				className={`${styles.toggler}`}
				type="button"
				onClick={toggle}
			>
				<div className={`${styles.togglerIcon} ${isOpen ? styles.open : ""}`}>
					<span></span>
				</div>
			</button>
		</nav>
	);
};

export default Navbar;
