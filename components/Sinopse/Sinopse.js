import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";
import Grid from "components/Grid/Grid";
import { useState } from "react";
import moment from "moment";
import Placeholder from "components/Placeholder/Placeholder";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import { AnimatePresence, motion } from "framer-motion";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const { t } = useTranslation();

	const handleClick = () => {
		setShowTrailer(!showTrailer);
	};
	return (
		<Grid>
			<Grid.Col sm="screen-start / screen-end" rowSm="1/-1" zIndex="1">
				<div className={styles.cover}>
					{filme.imagem.url && (
						<Placeholder
							src={filme.imagem.url}
							width={filme.imagem.dimensions.width}
							height={filme.imagem.dimensions.height}
							layout="responsive"
						/>
					)}
				</div>
			</Grid.Col>
			<Grid.Col md="grid-start / col-7" rowSm="1 / 2" zIndex="2">
				<div className={styles.sinopse}>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<h1 className={`h-1 ${styles.title}`}>
							<Text asText content={filme.titulo} />{" "}
							<span className={styles.year}>
								{moment(filme.lancamento).format("Y")}
							</span>
						</h1>
						<FilmDirectors technical={filme.ficha_tecnica} />
						<h2 className={`visually-hidden`}>{t("common:sinopse")}</h2>
						<div className={`${styles.text} body`}>
							<Text content={filme.sinopse} />
						</div>
					</motion.div>
				</div>
			</Grid.Col>
		</Grid>
	);
};
export default Sinopse;
