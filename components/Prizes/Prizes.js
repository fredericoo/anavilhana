import styles from "./Prizes.module.scss";
import useTranslation from "next-translate/useTranslation";
import Prize from "./Prize";
import Button from "components/Button/Button";
import Columns from "components/Columns/Columns";
import { useState } from "react";

const Prizes = ({ prizes, display = 6, perPage = 6 }) => {
	const [show, setShow] = useState(display);
	if (!prizes || !prizes[0].premio_titulo) return null;
	const { t } = useTranslation();
	const showMore = () => {
		setShow(Math.min(show + perPage, prizes.length));
	};

	return (
		<div className={`${styles.section} grid grid--inner`}>
			<h2 className={`h-2 ${styles.heading}`}>{t("common:premiacoes")}</h2>
			<Columns sm={2} md={3} className={`${styles.prizes}`}>
				{prizes.slice(0, show).map((premio, key) => (
					<Prize
						key={key}
						title={premio.premio_titulo}
						year={premio.premio_ano}
						info={premio.premio_info}
						link={premio.premio_link}
					/>
				))}
			</Columns>
			{prizes.length > 1 && (
				<div className={`s-sm ${styles.showing}`}>
					{t("common:showing")} {Math.min(show, prizes.length)} {t("common:of")}{" "}
					{prizes.length}
				</div>
			)}
			{show < prizes.length && (
				<div className={styles.showMore}>
					<Button type="link" onClick={showMore}>
						{t("common:proximaPagina")}
					</Button>
				</div>
			)}
		</div>
	);
};
export default Prizes;
