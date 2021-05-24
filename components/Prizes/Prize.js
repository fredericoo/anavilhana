import styles from "./Prize.module.scss";
import Link from "next/link";

const Prize = ({ title, year, info, link }) => (
	<div className={styles.prize}>
		<div className={styles.textBox}>
			{link?.url ? (
				<Link href={link.url}>
					<a className={styles.link} target="_blank">
						<h3 className={`smcp ${styles.title}`}>{title}</h3>
					</a>
				</Link>
			) : (
				<h3 className={`smcp ${styles.title}`}>{title}</h3>
			)}
			{info && <div className={styles.info}>{info}</div>}
			<div className={styles.year}>{year}</div>
		</div>
		<img className={styles.laurel} src="/img/laurel.svg" />
	</div>
);

export default Prize;
