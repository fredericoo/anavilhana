import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";
import Grid from "components/Grid/Grid";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import Placeholder from "components/Placeholder/Placeholder";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const { t } = useTranslation();
	const [playing, setPlaying] = useState(false);
	const videoRef = useRef();
	const playVid = useRef();

	useEffect(() => {
		setPlaying(false);
		clearTimeout(playVid.current);
		playVid.current = setTimeout(() => {
			setPlaying(true);
		}, 1200);
		return () => clearTimeout(playVid.current);
	}, []);

	useEffect(() => {
		playing && videoRef.current && videoRef.current.play();
	}, [playing]);

	return (
		<Grid className={styles.grid}>
			<Grid.Col sm="screen-start / screen-end" rowSm="1/-1" zIndex="1">
				<div className={styles.cover}>
					{filme.imagem.url && (
						<Placeholder src={filme.imagem.url} layout="fill" />
					)}
					{(filme.video720?.url || filme.video360?.url) && (
						<AnimatePresence>
							{playing && (
								<motion.div
									className={styles.video}
									initial={{ opacity: 0, scale: 1.5 }}
									animate={{ opacity: 1, scale: 1.2 }}
									exit={{ opacity: 0, scale: 1 }}
								>
									<VideoPlayer
										src={filme.video720.url || filme.video360.url}
										width="640"
										height="360"
										ref={videoRef}
										layout="fill"
										videoProps={{
											muted: true,
											loop: true,
											controls: false,
											autoPlay: true,
											playsInline: true,
										}}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</div>
			</Grid.Col>
			<Grid.Col
				className={styles.sinopse}
				lg="grid-start / col-6"
				rowSm="1 / -1"
				zIndex="2"
			>
				<div>
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
				</div>
			</Grid.Col>
		</Grid>
	);
};
export default Sinopse;
