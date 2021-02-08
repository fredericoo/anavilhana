import styles from "./Sinopse.module.scss";
import useTranslation from "next-translate/useTranslation";
import Text from "components/Text/Text";

const Sinopse = ({ filme }) => {
	if (!filme.sinopse) return null;
	const { t } = useTranslation();

	return (
		<section className={`${styles.section} grid grid--inner`}>
			<div className={styles.textBox}>
				<h2 className={`${styles.heading} h-3`}>{t("common:sinopse")}</h2>
				<div className={`${styles.sinopse} body`}>
					<Text content={filme.sinopse} />
				</div>
			</div>
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
		</section>
	);
};
export default Sinopse;
