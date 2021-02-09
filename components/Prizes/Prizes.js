import styles from "./Prizes.module.scss";
import useTranslation from "next-translate/useTranslation";
import Prize from "./Prize";
import Button from "components/Button/Button";
import { useState } from "react";

const Prizes = ({ prizes }) => {
	const [show, setShow] = useState(6);
	if (!prizes || !prizes[0].premio_titulo) return null;
	const { t } = useTranslation();
	const showMore = () => {
		setShow(prizes.length);
	};

	return (
		<div className={`${styles.section} grid grid--inner`}>
			<h2 className={`h-2 ${styles.heading}`}>{t("common:premiacoes")}</h2>
			<div className={`${styles.prizes}`}>
				{prizes.slice(0, show).map((premio, key) => (
					<Prize
						key={key}
						title={premio.premio_titulo}
						year={premio.premio_ano}
						info={premio.premio_info}
					/>
				))}
			</div>
			{show < prizes.length && (
				<div className={styles.showMore}>
					<Button type="link" onClick={showMore}>
						{t("common:mais")} ({prizes.length})
					</Button>
				</div>
			)}
		</div>
	);
};
export default Prizes;
