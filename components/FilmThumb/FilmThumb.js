import styles from "./FilmThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";
import Image from "next/image";
import Placeholder from "components/Placeholder/Placeholder";
import { RichText } from "prismic-reactjs";

const FilmThumb = ({ obra }) => (
	<Link href={hrefResolver(obra)}>
		<a className={styles.obra}>
			<div className={styles.imagem}>
				{!!obra.data.imagem.url && (
					<Image
						src={obra.data.imagem.url}
						layout="fill"
						objectFit="cover"
						sizes="(max-width: 768px) 150px,
    								(max-width: 1920px) 300px,
    								600px"
					/>
				)}
				{!obra.data.imagem.url && (
					<div className={styles.noPic}>
						{RichText.asText(obra.data.titulo).charAt(0)}
					</div>
				)}
			</div>
			<h3 className={styles.titulo}>
				{RichText.asText(obra.data.titulo)}
				{obra.data.lancamento && (
					<span className={styles.ano}>
						{moment(obra.data.lancamento).format("Y")}
					</span>
				)}
			</h3>
		</a>
	</Link>
);

export default FilmThumb;
