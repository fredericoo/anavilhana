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
					return {
						nome: item.nome,
						membro: item.membro,
						externo: item.externo,
					};
				}),
		};
	});

	const { t } = useTranslation();
	return (
		<Columns className={styles.items} sm={2} md={3}>
			{fichaTecnica.map((item, key) => (
				<Task key={key} task={item.task} doers={item.doers} />
			))}
		</Columns>
	);
};

const Task = ({ task, doers }) => {
	return (
		<div className={styles.item}>
			<h3 className={styles.task}>{task}</h3>
			<ul className={styles.doers}>
				{doers.map((doer, key) => {
					return (
						<li key={key}>
							<MemberName doer={doer} />
						</li>
					);
				})}
			</ul>
		</div>
	);
};

const MemberName = ({ doer }) => {
	if (doer.membro.uid) {
		return (
			<Link href={hrefResolver(doer.membro)}>
				<a>
					{doer.nome
						? doer.nome
						: doer.membro.data
						? RichText.asText(doer.membro.data.nome)
						: doer.membro.uid}
				</a>
			</Link>
		);
	} else if (doer.externo.url) {
		return (
			<Link href={hrefResolver(doer.externo)}>
				<a target="_blank">{doer.nome}</a>
			</Link>
		);
	} else {
		return doer.nome;
	}
};

export default TechnicalDetails;
