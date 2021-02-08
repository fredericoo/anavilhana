import styles from "./TechnicalDetails.module.scss";
import useTranslation from "next-translate/useTranslation";
import { hrefResolver } from "prismic-configuration";
import Link from "next/link";
import Columns from "components/Columns/Columns";
import { RichText } from "prismic-reactjs";

const TechnicalDetails = ({ details }) => {
	if (!details) return null;
	const fichaTecnica = Array.from(
		new Set(details.map((item) => item.tarefa))
	).map((task) => {
		return {
			task,
			doers: details
				.filter((item) => item.tarefa === task)
				.map((item) => {
					return { nome: item.nome, membro: item.membro };
				}),
		};
	});

	const { t } = useTranslation();
	return (
		<section className={`${styles.section} grid grid--inner`}>
			<h2 className={`h-2 ${styles.heading}`}>{t("common:fichaTecnica")}</h2>
			<Columns className={styles.items} sm={2} md={2}>
				{fichaTecnica.map((item) => (
					<Task task={item.task} doers={item.doers} />
				))}
			</Columns>
		</section>
	);
};

const Task = ({ task, doers }) => {
	return (
		<div className={styles.task}>
			<h3 className={styles.task}>{task}</h3>
			<ul className={styles.doers}>
				{doers.map((doer, key) => {
					return (
						<li key={key}>
							{doer.membro && doer.membro.uid ? (
								<Link href={hrefResolver(doer.membro)}>
									<a>
										{doer.nome
											? doer.nome
											: doer.membro.data
											? RichText.asText(doer.membro.data.nome)
											: doer.membro.uid}
									</a>
								</Link>
							) : (
								doer.nome
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default TechnicalDetails;
