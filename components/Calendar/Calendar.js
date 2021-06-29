import styles from "./Calendar.module.scss";
import moment from "moment";
import { useState, useEffect } from "react";
import { weekdays, monthsFull } from "./constants/dates";
import {
	getDayOfMonth,
	getMonth,
	getYear,
	getMonthDayYear,
} from "./utils/moment-utils";
import { getDatesInMonthDisplay, getMonthSet } from "./utils/date-utils";
import Button from "components/Button/Button";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import { useDocuments } from "utils/hooks/useDocuments";

const Calendar = () => {
	const data = useDocuments();

	const [markedDates, setMarkedDates] = useState([]);
	const [selectDate, setSelectDate] = useState(moment().toDate());

	useEffect(() => {
		data &&
			setMarkedDates(
				data
					.filter((doc) => doc.type === "filme")
					.map((filme) =>
						filme.data.exibicoes.map((exibicao) =>
							getMonthDayYear(moment(exibicao.datetime))
						)
					)
					.flat()
			);
	}, [data]);

	const handleDateChange = (date) => {
		setSelectDate(date);
	};

	return (
		<div className={`grid grid--inner`}>
			<div className={styles.calendar}>
				<CalendarFooter selectDate={selectDate} setSelectDate={setSelectDate} />
				<CalendarHeader />
				<CalendarBody
					selectDate={selectDate}
					setSelectDate={handleDateChange}
					markedDates={markedDates}
				/>
			</div>

			<CalendarAirings
				selectDate={selectDate}
				filmes={data.filter((doc) => doc.type === "filme")}
			/>
		</div>
	);
};

const CalendarAirings = ({ selectDate, filmes }) => {
	const { t } = useTranslation();
	if (!filmes)
		return (
			<div className={styles.airings}>
				<div className={styles.scroll}>
					<header className={`${styles.header} h-3`}>
						{`${t("common:exibicoesEm")} ${moment(selectDate).format("DD/MM")}`}
					</header>
					<div className={`${styles.notFound} s-sm`}>
						{t("common:carregando")}
					</div>
				</div>
			</div>
		);

	const eventsToday = filmes
		.map((filme) =>
			filme.data.exibicoes.map((exibicao) => {
				return {
					film: filme,
					fullDate: moment(exibicao.datetime),
					local: exibicao.local,
					custom_sinopse: exibicao.custom_sinopse,
					date: getMonthDayYear(moment(exibicao.datetime)),
					allday: exibicao.allday,
				};
			})
		)
		.flat()
		.filter((event) => event.date === getMonthDayYear(moment(selectDate)));

	return (
		<div className={styles.airings}>
			<div className={styles.scroll}>
				<header className={`${styles.header} h-3`}>
					{`${t("common:exibicoesEm")} ${moment(selectDate).format("DD/MM")}`}
				</header>
				{!!eventsToday.length ? (
					eventsToday.map((event) => (
						<SingleEvent key={event.film.uid + event.fullDate} event={event} />
					))
				) : (
					<div className={`${styles.notFound} s-sm`}>
						{t("common:nenhumaExibicao")}
					</div>
				)}
			</div>
		</div>
	);
};

const CalendarHeader = () => {
	return (
		<header className={styles.header}>
			{weekdays.map((weekday) => (
				<div key={weekday} className={`${styles.date} smcp`}>
					{weekday}
				</div>
			))}
		</header>
	);
};

const CalendarBody = ({ selectDate, setSelectDate, markedDates }) => {
	const datesInMonth = getDatesInMonthDisplay(
		getMonth(selectDate) + 1,
		getYear(selectDate)
	);

	const changeDate = (e) => {
		setSelectDate(e.target.getAttribute("data-date"));
	};

	return (
		<div className={styles.body}>
			{datesInMonth.map((i, key) => (
				<button
					type="button"
					className={`${styles.date} ${
						i.date.toString() === selectDate ? styles.active : ""
					} ${
						markedDates.includes(getMonthDayYear(i.date)) ? styles.marked : ""
					}`}
					data-active-month={i.currentMonth}
					data-date={i.date.toString()}
					key={key}
					onClick={changeDate}
				>
					{getDayOfMonth(i.date)}
				</button>
			))}
		</div>
	);
};

const CalendarFooter = ({ selectDate, setSelectDate }) => {
	const changeMonth = (date) => {
		setSelectDate(date);
	};
	const monthSet = getMonthSet(selectDate);
	return (
		<div className={styles.footer}>
			<Button type="arrowBack" onClick={() => changeMonth(monthSet.prev)}>
				{monthsFull[getMonth(monthSet.prev)]}
			</Button>
			<h3 className={`${styles.month}`}>
				{monthsFull[getMonth(monthSet.current)]} {getYear(selectDate)}
			</h3>
			<Button type="arrow" onClick={() => changeMonth(monthSet.next)}>
				{monthsFull[getMonth(monthSet.next)]}
			</Button>
		</div>
	);
};

const SingleEvent = ({ event }) => {
	return (
		<div className={styles.event}>
			<Link href={hrefResolver(event.film)}>
				<a>
					<h3 className={`${styles.filmName} h-4`}>
						{RichText.asText(event.film.data.titulo)}
					</h3>
				</a>
			</Link>
			<div className={`${styles.dateTime} smcp`}>
				{event.allday
					? event.fullDate.format("DD/MM")
					: event.fullDate.format("DD/MM, HH:mm")}
				{<RichText render={event.local} />}
			</div>
			<div className={`s-sm ${styles.synopsis}`}>
				<RichText
					render={
						!!event.custom_sinopse.length
							? event.custom_sinopse
							: event.film.data.sinopse
					}
				/>
			</div>
		</div>
	);
};

export default Calendar;
