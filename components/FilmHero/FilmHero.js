import styles from "./FilmHero.module.scss";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";

const FilmHero = ({ filmes }) => {
	if (!filmes || !filmes.length) return null;

	const [active, setActive] = useState(filmes[0].uid);
	const [image, setImage] = useState(filmes[0].data.imagem);
	const { t } = useTranslation();

	const handleMouseEnter = (filme) => {
		setActive(filme.uid);
		setImage(filme.data.imagem);
	};

	return (
		<section className={`${styles.section}`}>
			<div className={`grid grid--full ${styles.grid}`}>
				<h1 className="visually-hidden">{t("common:filmes")}</h1>
				<AnimatePresence>
					{image.url && (
						<motion.div
							key={image.url}
							initial={{ opacity: 0, scale: 1.5 }}
							animate={{ opacity: 0.6, scale: 1.2 }}
							exit={{ opacity: 0, scale: 1 }}
							transition={{ ease: "easeOut", duration: 0.3 }}
							className={styles.image}
						>
							<Image src={image.url} objectFit="cover" layout="fill" />
						</motion.div>
					)}
				</AnimatePresence>
				<div className={styles.films}>
					{filmes.map((filme) => (
						<Link href={`/filme/${filme.uid}`} key={filme.uid}>
							<a
								onMouseEnter={() => handleMouseEnter(filme)}
								className={`${styles.film} ${
									active === filme.uid ? styles.active : ""
								}`}
							>
								<h2 className={`h-2 ${styles.name}`}>
									{RichText.asText(filme.data.titulo)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={styles.icon}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1"
										strokeLinecap="butt"
										strokeLinejoin="arcs"
									>
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="12" y1="8" x2="12" y2="16"></line>
										<line x1="8" y1="12" x2="16" y2="12"></line>
									</svg>
									<span className={styles.year}>
										{moment(filme.data.lancamento).format("Y")}
									</span>
								</h2>
								<FilmDirectors technical={filme.data.ficha_tecnica} />
							</a>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};
export default FilmHero;
