import styles from "./FilmHero.module.scss";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const FilmHero = ({ filmes }) => {
	if (!filmes.length) return <>Erro ao carregar filmes</>;

	const [active, setActive] = useState(filmes[0].uid);
	const [image, setImage] = useState(filmes[0].data.imagem);
	const { t } = useTranslation();

	const handleMouseEnter = (filme) => {
		setActive(filme.uid);
		setImage(filme.data.imagem);
	};

	return (
		<section className={`${styles.section} grid grid--full`}>
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
								<span className={styles.year}>
									{moment(filme.data.lancamento).format("Y")}
								</span>
							</h2>
						</a>
					</Link>
				))}
			</div>
		</section>
	);
};
export default FilmHero;
