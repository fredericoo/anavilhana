import styles from "./Prize.module.scss";

const Prize = ({ title, year, info }) => (
	<div className={styles.prize}>
		<div className={styles.textBox}>
			<h3 className={`smcp ${styles.title}`}>{title}</h3>
			{info && <div className={styles.info}>{info}</div>}
			<div className={styles.year}>{year}</div>
		</div>
		<img className={styles.laurel} src="/img/laurel.svg" />
	</div>
);

export default Prize;
