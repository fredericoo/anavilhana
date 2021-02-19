import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";
import Grid from "components/Grid/Grid";
import { useState, useRef } from "react";
import moment from "moment";
import Placeholder from "components/Placeholder/Placeholder";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import VideoPlayer from "components/VideoPlayer/VideoPlayer";
import animateScrollTo from "animated-scroll-to";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const { t } = useTranslation();
	const imgRef = useRef();

	const [trailer, setTrailer] = useState(false);
	const [preview, setPreview] = useState(false);

	const handleClick = () => {
		animateScrollTo(0);
		setTrailer(!trailer);
	};

	return (
		<Grid>
			<Grid.Col
				sm="screen-start / screen-end"
				lg="col-6 / screen-end"
				rowLg="1/-1"
				zIndex="1"
			>
				<div className={styles.cover} ref={imgRef}>
					{filme.imagem.url && !trailer && (
						<Placeholder
							src={filme.imagem.url}
							width={filme.imagem.dimensions.width}
							height={filme.imagem.dimensions.height}
							layout="responsive"
						/>
					)}
					{trailer && (
						<VideoPlayer
							html={filme.trailer.html}
							width={filme.trailer.width}
							height={filme.trailer.height}
							autoPlay
						/>
					)}
				</div>
			</Grid.Col>
			<Grid.Col lg="grid-start / col-6" rowLg="1 / 2" zIndex="2">
				<div className={styles.sinopse}>
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
							{filme.trailer && (
								<button
									type="button"
									onClick={handleClick}
									className={`${styles.trailer} h-4`}
								>
									{trailer ? (
										<>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1"
												strokeLinecap="butt"
												strokeLinejoin="arcs"
											>
												<circle cx="12" cy="12" r="10"></circle>
												<line x1="15" y1="9" x2="9" y2="15"></line>
												<line x1="9" y1="9" x2="15" y2="15"></line>
											</svg>
											{t("common:fechar")}
										</>
									) : (
										<>
											<svg
												className={styles.icon}
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1"
												strokeLinecap="butt"
												strokeLinejoin="arcs"
											>
												<circle cx="12" cy="12" r="10"></circle>
												<polygon points="10 8 16 12 10 16 10 8"></polygon>
											</svg>
											{t("common:assistirTrailer")}
										</>
									)}
								</button>
							)}
						</div>
					</div>
				</div>
			</Grid.Col>
		</Grid>
	);
};
export default Sinopse;
