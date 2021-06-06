import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";
import Grid from "components/Grid/Grid";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const [random, _] = useState(
		filme.imagens[Math.floor(Math.random() * filme.imagens.length)]
	);
	const [loadingVideo, setLoadingVideo] = useState(false);
	const { t } = useTranslation();
	const [playing, setPlaying] = useState(false);
	const videoRef = useRef();
	const playVid = useRef();
	const hasVideo = !!random.video720?.url || !!random.video360?.url;

	useEffect(() => {
		setPlaying(false);
		clearTimeout(playVid.current);
		hasVideo && setLoadingVideo(true);
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
					{random.imagem?.url && (
						<Image
							className={`${loadingVideo ? styles.loadingVideo : ""}`}
							src={random.imagem.url}
							layout="fill"
							sizes={
								hasVideo
									? `(max-width: 768px) 60px,
    								(max-width: 1920px) 150px,
    								300px`
									: `(max-width: 768px) 300px,
    								(max-width: 1920px) 600px,
    								1200px`
							}
							quality={hasVideo ? 10 : 100}
							objectFit="cover"
						/>
					)}
					{hasVideo && (
						<AnimatePresence>
							{playing && (
								<motion.div
									className={styles.video}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.5 }}
								>
									<VideoPlayer
										src={random.video720.url || random.video360.url}
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
					<div className={"s-sm"}>
						<Text content={filme.formato} />
						{filme.duracao && filme.formato && ","}{" "}
						{filme.duracao && <Text content={filme.duracao + " min"} />}
					</div>
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
