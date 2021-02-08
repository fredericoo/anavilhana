import styles from "./MemberDetails.module.scss";

import { RichText } from "prismic-reactjs";

import Placeholder from "components/Placeholder/Placeholder";
import Prize from "components/Prizes/Prize";
import Columns from "components/Columns/Columns";

import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import moment from "moment";

const MemberDetails = ({ member, obras }) => {
	const { t } = useTranslation();
	return (
		<section className={`${styles.section} grid grid--full`}>
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
			<div className={styles.body}>
				<h1 className={`h-1 ${styles.heading}`}>
					{RichText.asText(member.nome)},{" "}
					{member.posicao && <span className={`h-2`}>{member.posicao}</span>}
				</h1>
				<div className={`${styles.sobre} body`}>
					<RichText render={member.sobre} />
				</div>

				{!!member.premiacoes.length && member.premiacoes[0].premio_ano && (
					<div className={styles.prizes}>
						<h2 className={`h-2 ${styles.heading}`}>
							{t("common:premiacoes")}
						</h2>
						<Columns sm={3} md={3}>
							{member.premiacoes.map((prize, key) => (
								<Prize
									key={key}
									title={prize.premio_titulo}
									year={prize.premio_ano}
									info={prize.premio_info}
								/>
							))}
						</Columns>
					</div>
				)}

				{!!obras.length && (
					<div className={styles.obras}>
						<h2 className={`h-2 ${styles.heading}`}>{t("common:obras")}</h2>
						<Columns sm={3} md={3}>
							{obras.map((obra) => (
								<Obra obra={obra} />
							))}
						</Columns>
					</div>
				)}

				{!!member.montagens.length && member.montagens[0].ano && (
					<div className={styles.montagens}>
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
		</section>
	);
};

const Obra = ({ obra }) => (
	<Link href={hrefResolver(obra)}>
		<a className={styles.obra}>
			{obra.data.imagem && (
				<div className={styles.imagem}>
					<Placeholder
						src={obra.data.imagem.url}
						width={1920}
						height={1080}
						layout="responsive"
						sizes="(max-width: 768px) 150px,
    								(max-width: 1920px) 300px,
    								600px"
					/>
				</div>
			)}
			<h3 className={styles.titulo}>
				{RichText.asText(obra.data.titulo)}
				{obra.data.lancamento && (
					<span className={styles.ano}>
						{moment(obra.data.lancamento).format("Y")}
					</span>
				)}
			</h3>
		</a>
	</Link>
);

export default MemberDetails;
