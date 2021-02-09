import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const { t } = useTranslation();

	return (
		<div
			className={`${styles.section} ${
				filme.trailer.html ? styles.hasTrailer : ""
			} grid grid--inner`}
		>
			<div className={styles.textBox}>
				<h2 className={`${styles.heading} h-2`}>{t("common:sinopse")}</h2>
				<div className={`${styles.sinopse} body`}>
					<Text content={filme.sinopse} />
				</div>
			</div>
			{filme.trailer.html && (
				<figure className={styles.trailer}>
					<div
						className={styles.videoWrapper}
						style={{
							"--aspectRatio": filme.trailer.width / filme.trailer.height,
						}}
						dangerouslySetInnerHTML={{ __html: filme.trailer.html }}
					/>
					<figcaption className={`s-xs`}>{filme.trailer.title}</figcaption>
				</figure>
			)}
		</div>
	);
};
export default Sinopse;
