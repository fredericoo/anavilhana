import styles from "./FilmThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";
import Image from "next/image";
import { RichText } from "prismic-reactjs";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import { useState } from "react";
import { groupHasItems } from "utils/prismicHelpers";

const FilmThumb = ({ obra }) => {
	const [random, _] = useState(
		groupHasItems(obra.data.imagens) &&
			obra.data.imagens[Math.floor(Math.random() * obra.data.imagens.length)]
	);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const handleMouseEnter = () => setVideoLoaded(true);
	const handleMouseLeave = () => setVideoLoaded(false);

	return (
		<Link href={hrefResolver(obra)}>
			<a
				className={styles.obra}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className={styles.imagem}>
					{random.imagem && random.imagem.url && (
						<Image
							src={random.imagem.url}
							layout="fill"
							objectFit="cover"
							sizes="(max-width: 768px) 150px,
    								(max-width: 1920px) 300px,
    								600px"
						/>
					)}
					{(!random.imagem || !random.imagem.url) && (
						<div className={styles.noPic}>
							{RichText.asText(obra.data.titulo).charAt(0)}
						</div>
					)}
					{random.video360 && random.video360.url && (
						<div className={styles.hover}>
							{videoLoaded && (
								<VideoPlayer
									src={random.video360.url}
									width="640"
									height="360"
									videoProps={{
										autoPlay: true,
										muted: true,
										loop: true,
										controls: false,
									}}
								/>
							)}
						</div>
					)}
				</div>

				<h3 className={`${styles.titulo} h-4`}>
					{RichText.asText(obra.data.titulo)}{" "}
					{obra.data.lancamento && (
						<span className={styles.ano}>
							{moment(obra.data.lancamento).format("Y")}
						</span>
					)}
				</h3>
				<FilmDirectors
					technical={obra.data.ficha_tecnica}
					special={obra.data.tipo === "Especial"}
				/>
			</a>
		</Link>
	);
};

export default FilmThumb;
