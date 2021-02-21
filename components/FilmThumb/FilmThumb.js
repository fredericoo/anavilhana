import styles from "./FilmThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";
import Image from "next/image";
import { RichText } from "prismic-reactjs";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import { useState } from "react";

const FilmThumb = ({ obra }) => {
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
					{obra.data.imagem && obra.data.imagem.url && (
						<Image
							src={obra.data.imagem.url}
							layout="fill"
							objectFit="cover"
							sizes="(max-width: 768px) 150px,
    								(max-width: 1920px) 300px,
    								600px"
						/>
					)}
					{obra.data.imagem && !obra.data.imagem.url && (
						<div className={styles.noPic}>
							{RichText.asText(obra.data.titulo).charAt(0)}
						</div>
					)}
					{obra.data.video360 && obra.data.video360.url && (
						<div className={styles.hover}>
							{videoLoaded && (
								<VideoPlayer
									src={obra.data.video360.url}
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
				<FilmDirectors technical={obra.data.ficha_tecnica} />
			</a>
		</Link>
	);
};

export default FilmThumb;
