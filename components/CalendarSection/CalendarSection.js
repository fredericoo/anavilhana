import styles from "./CalendarSection.module.scss";
import Calendar from "components/Calendar/Calendar";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";

const CalendarSection = ({ filmes }) => {
	const { t } = useTranslation();
	return (
		<section className={`${styles.section}`}>
			<header className={`${styles.header} container`}>
				<h2 className={"h-1"}>{t("common:sala")}</h2>
			</header>
			<div className={styles.calendar}>
				<Calendar filmes={filmes} />
			</div>
		</section>
	);
};

export default CalendarSection;
