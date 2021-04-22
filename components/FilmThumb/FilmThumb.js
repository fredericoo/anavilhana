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
import Placeholder from "components/Placeholder/Placeholder";

const FilmThumb = ({ obra }) => {
	const validImages = obra.data.imagens.filter((img) => img.imagem.url);
	const [random, _] = useState(
		validImages.length
			? obra.data.imagens[Math.floor(Math.random() * validImages.length)]
			: validImages
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
						<Placeholder
							src={random.imagem.url}
							layout="fill"
							objectFit="cover"
						/>
					)}
					{(!random.imagem || !random.imagem.url) && (
						<div className={styles.noPic}>
							{RichText.asText(obra.data.titulo).charAt(0)}
						</div>
					)}
					{random.video360?.url && videoLoaded && (
						<VideoPlayer
							className={styles.hover}
							layout="fill"
							src={random.video360.url}
							width="1920"
							height="1080"
							videoProps={{
								playsInline: true,
								autoPlay: true,
								muted: true,
								loop: true,
								controls: false,
							}}
						/>
					)}
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
