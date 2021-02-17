import { RichText } from "prismic-reactjs";
import useTranslation from "next-translate/useTranslation";
import styles from "./FilmDirectors.module.scss";

const FilmDirectors = ({ technical }) => {
	const { t } = useTranslation();

	if (!technical) return null;
	const directors = technical
		.filter(
			(item) => item.tarefa.toLowerCase() === t("common:direcao").toLowerCase()
		)
		.map((item) => ({ nome: item.nome, membro: item.membro }));
	if (!directors.length) return null;
	return (
		<div className={styles.directedBy}>
			<span className={styles.label}>{t("common:direcao")}</span>{" "}
			<ul className={styles.directors}>
				{directors.map((doer, key) => {
					return (
						<li className={styles.person} key={key}>
							{doer.membro && doer.membro.uid
								? doer.nome
									? doer.nome
									: doer.membro.data
									? RichText.asText(doer.membro.data.nome)
									: doer.membro.uid
								: doer.nome}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default FilmDirectors;
