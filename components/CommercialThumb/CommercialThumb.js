import styles from "./CommercialThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";
import Image from "next/image";
import { RichText } from "prismic-reactjs";
import FilmDirectors from "components/FilmDirectors/FilmDirectors";
import { groupHasItems } from "utils/prismicHelpers";
import Columns from "components/Columns/Columns";
import WatchLink from "components/WatchLink/WatchLink";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";

const CommercialThumb = ({ obra }) => {
	const { t } = useTranslation();
	return (
		<Columns sm="1" md="2" className={styles.obra}>
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
				{!obra.data.imagem?.url && (
					<div className={styles.noPic}>
						{RichText.asText(obra.data.titulo).charAt(0)}
					</div>
				)}
			</div>

			<div>
				<h3 className={`${styles.titulo} h-3`}>
					{RichText.asText(obra.data.titulo)}{" "}
					{obra.data.data && (
						<span className={styles.ano}>
							{moment(obra.data.data).format("Y")}
						</span>
					)}
				</h3>
				<div className={`body s-sm ${styles.sinopse}`}>
					<Text content={obra.data.sinopse} />
				</div>
				<FilmDirectors technical={obra.data.ficha_tecnica} />
				{groupHasItems(obra.data.downloads) &&
					obra.data.downloads[0].download_link.url && (
						<Columns sm="1" md="2">
							{obra.data.downloads.map((download, key) => (
								<WatchLink
									key={key}
									platform={download.download_titulo}
									subtitle={
										download.download_privado ? t("common:privado") : ""
									}
									link={download.download_link}
								/>
							))}
						</Columns>
					)}
			</div>
		</Columns>
	);
};

export default CommercialThumb;
