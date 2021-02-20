import styles from "./MemberDetails.module.scss";

import { RichText } from "prismic-reactjs";

import Placeholder from "components/Placeholder/Placeholder";
import Columns from "components/Columns/Columns";
import FilmThumb from "components/FilmThumb/FilmThumb";

import useTranslation from "next-translate/useTranslation";

import ScrollNav from "components/ScrollNav/ScrollNav";
import ArticlesTable from "components/ArticlesTable/ArticlesTable";
import { groupHasItems } from "utils/prismicHelpers";

const MemberDetails = ({ member, obras, artigos }) => {
	const { t } = useTranslation();

	return (
		<div className={`${styles.container} grid grid--full`}>
			<nav className={styles.nav}>
				<ScrollNav
					items={[
						{ label: t("common:sobre"), id: "sobre" },
						{ label: t("common:obras"), id: "obras" },
						{ label: t("common:criticas"), id: "criticas" },
						{ label: t("common:montagens"), id: "montagens" },
					]}
				/>
			</nav>
			<header className={styles.header}>
				{member.imagem && (
					<div className={styles.image}>
						<Placeholder
							src={member.imagem.url}
							alt={member.imagem.alt}
							width={1200}
							height={1400}
							layout="responsive"
							sizes="(max-width: 768px) 150px,
                                    (max-width: 1920px) 300px,
                                    600px"
						/>
					</div>
				)}
				<div className={styles.info}>
					{member.email && <div>{member.email}</div>}
				</div>
			</header>
			<div id="sobre" className={styles.body}>
				<h1 className={`h-1 ${styles.heading}`}>
					{RichText.asText(member.nome)}
					{member.posicao && (
						<>
							, <div className={`h-2`}>{member.posicao}</div>
						</>
					)}
				</h1>
				<h2 className="visually-hidden">{t("common:sobre")}</h2>
				<div className={`${styles.sobre} body`}>
					<RichText render={member.sobre} />
				</div>

				{groupHasItems(obras) && (
					<div id="obras" className={`${styles.section}`}>
						<h2 className={`h-2 ${styles.heading}`}>{t("common:obras")}</h2>
						<Columns sm={2} md={2}>
							{obras.map((obra) => (
								<FilmThumb key={obra.uid} obra={obra} />
							))}
						</Columns>
					</div>
				)}

				{groupHasItems(artigos) && (
					<div id="criticas" className={`${styles.section}`}>
						<h2 className={`h-2 ${styles.heading}`}>{t("common:criticas")}</h2>
						<ArticlesTable articles={artigos} />
						{/* <Columns sm={1} md={2}>
							{artigos.map((artigo, key) => (
								<ArticleThumb key={key} article={artigo} />
							))}
						</Columns> */}
					</div>
				)}

				{!!member.montagens.length && member.montagens[0].ano && (
					<div id="montagens" className={`${styles.section}`}>
						<h2 className={`h-2 ${styles.heading}`}>{t("common:montagens")}</h2>
						<ul>
							{member.montagens.map((montagem, key) => (
								<li key={key}>
									{montagem.ano} - {RichText.asText(montagem.titulo)} -{" "}
									{RichText.asText(montagem.texto)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default MemberDetails;
