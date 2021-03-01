import styles from "./FilmHero.module.scss";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import { useState, useRef, useEffect } from "react";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";

const FilmHero = ({ filmes }) => {
	if (!filmes || !filmes.length) return null;
	const { t } = useTranslation();
	const [active, setActive] = useState(filmes[0]);

	const [playing, setPlaying] = useState(false);
	const playVid = useRef();

	const handleMouseEnter = (filme) => {
		setActive(filme);
	};

	useEffect(() => {
		setPlaying(false);
		clearTimeout(playVid.current);
		playVid.current = setTimeout(() => {
			setPlaying(true);
		}, 1200);
		return () => clearTimeout(playVid.current);
	}, [active]);

	return (
		<section className={`grid grid--full ${styles.grid}`}>
			<h1 className="visually-hidden">{t("common:filmes")}</h1>
			<AnimatePresence>
				{active.data.imagem.url && (
					<motion.div
						key={active.data.imagem.url}
						initial={{ opacity: 0, scale: 1.5 }}
						animate={{ opacity: 0.7, scale: 1.2 }}
						exit={{ opacity: 0, scale: 1 }}
						transition={{ ease: "easeOut", duration: 0.3 }}
						className={styles.image}
					>
						<Image
							src={active.data.imagem.url}
							objectFit="cover"
							layout="fill"
						/>
						{(active.data.video720 || active.data.video360) && playing && (
							<VideoPlayer
								src={active.data.video720.url || active.data.video360.url}
								width="640"
								height="360"
								layout="fill"
								videoProps={{
									muted: true,
									loop: true,
									controls: false,
									autoPlay: true,
									playsInline: true,
								}}
							/>
						)}
					</motion.div>
				)}
			</AnimatePresence>
			<div className={styles.films}>
				{filmes.map((filme) => (
					<Link href={hrefResolver(filme)} key={filme.uid}>
						<a
							onMouseEnter={() => handleMouseEnter(filme)}
							className={`${styles.film} ${
								active === filme ? styles.active : ""
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
			<Link href={"/filmes"}>
				<a className={styles.more}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
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
				</a>
			</Link>
		</section>
	);
};
export default FilmHero;
