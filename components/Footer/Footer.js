import styles from "./Footer.module.scss";
import { default as NextLink } from "next/link";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import { hrefResolver } from "prismic-configuration";

const Footer = ({ config }) => {
	const { t } = useTranslation();

	return (
		<footer className={`${styles.section} grid grid--inner`}>
			<h2 className="visually-hidden">{t("common:rodape")}</h2>
			<div className={styles.summary}>
				{config && <RichText render={config.data.resumo} />}
				{config && (
					<div className={styles.social}>
						{config.data.social.map((item, index) => (
							<NextLink key={index} href={hrefResolver(item.link)} passHref>
								<a>
									<img src={item.icone.url} />
								</a>
							</NextLink>
						))}
					</div>
				)}
			</div>
			<ul className={styles.footerMenu}>
				{config &&
					config.data.menu_rodape.map((item, index) => (
						<li key={index}>
							<NextLink href={hrefResolver(item.link)} passHref>
								<a>{item.opcao}</a>
							</NextLink>
						</li>
					))}
			</ul>
			<div className={styles.address}>
				{config && <RichText render={config.data.endereco} />}
			</div>
		</footer>
	);
};
export default Footer;
