import styles from "./Prizes.module.scss";
import useTranslation from "next-translate/useTranslation";
import Prize from "./Prize";

const Prizes = ({ prizes }) => {
	if (!prizes || !prizes[0].premio_titulo) return null;
	const { t } = useTranslation();
	return (
		<section className={`${styles.section} grid grid--inner`}>
			<h2 className={`h-2 ${styles.heading}`}>{t("common:premiacoes")}</h2>
			<div className={`${styles.prizes}`}>
				{prizes.map((premio, key) => (
					<Prize
						key={key}
						title={premio.premio_titulo}
						year={premio.premio_ano}
						info={premio.premio_info}
					/>
				))}
			</div>
		</section>
	);
};
export default Prizes;
