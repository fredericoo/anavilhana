import styles from "./MemberDetails.module.scss";

import { RichText } from "prismic-reactjs";
import { hrefResolver } from "prismic-configuration";

import Placeholder from "components/Placeholder/Placeholder";
import Columns from "components/Columns/Columns";
import FilmThumb from "components/FilmThumb/FilmThumb";

import useTranslation from "next-translate/useTranslation";

import ScrollNav from "components/ScrollNav/ScrollNav";
import ArticlesTable from "components/ArticlesTable/ArticlesTable";
import { groupHasItems } from "utils/prismicHelpers";
import Button from "components/Button/Button";
import Table from "components/Table/Table";

const MemberDetails = ({ member, obras, artigos }) => {
	const { t } = useTranslation();

	return (
		<div className={`${styles.container} grid grid--full`}>
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
				<dl className={`${styles.info} s-sm`}>
					{member.email && (
						<>
							<dt className="smcp">{t("common:email")}</dt>
							<dd>{member.email}</dd>
						</>
					)}
					{member.social.map((social, key) => (
						<dd key={key}>
							<Button
								target="_blank"
								type="link"
								href={hrefResolver(social.link)}
							>
								{social.rede}
							</Button>
						</dd>
					))}
				</dl>
			</header>
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
						<ArticlesTable articles={artigos} perPage={2} />
					</div>
				)}

				{!!member.montagens.length && member.montagens[0].ano && (
					<div id="montagens" className={`${styles.section}`}>
						<h2 className={`h-2 ${styles.heading}`}>{t("common:montagens")}</h2>
						<ul>
							<Table
								rows={member.montagens}
								columns={[
									{
										label: t("common:ano"),
										content: (row) => row.ano,
										size: 2,
									},
									{
										label: t("common:obra"),
										content: (row) => (
											<>
												<h3 className="h-6">{RichText.asText(row.titulo)}</h3>
												<div className="l-2">
													<RichText render={row.texto} />
												</div>
											</>
										),
										size: 6,
									},
									{
										label: t("common:tarefa"),
										content: (row) => <RichText render={row.tarefa} />,
										size: 4,
									},
								]}
								perPage={3}
							/>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default MemberDetails;
