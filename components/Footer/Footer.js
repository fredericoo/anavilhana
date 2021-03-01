import styles from "./Footer.module.scss";
import { default as NextLink } from "next/link";
import useTranslation from "next-translate/useTranslation";
import { RichText } from "prismic-reactjs";
import { hrefResolver } from "prismic-configuration";
import Grid from "components/Grid/Grid";

const Footer = ({ config }) => {
	const { t } = useTranslation();

	return (
		<footer className={`${styles.section}`}>
			<h2 className="visually-hidden">{t("common:rodape")}</h2>
			<Grid>
				<Grid.Col lg="grid-start / col-7" className="s-sm">
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
				</Grid.Col>
				<Grid.Col lg="span 3">
					<ul className={`${styles.menu} s-sm`}>
						{config &&
							config.data.menu_rodape.map((item, index) => (
								<li key={index}>
									<NextLink href={hrefResolver(item.link)} passHref>
										<a>{item.opcao}</a>
									</NextLink>
								</li>
							))}
					</ul>
				</Grid.Col>
				<Grid.Col lg="span 3">
					<address className="s-sm l-2">
						{config && <RichText render={config.data.endereco} />}
					</address>
				</Grid.Col>
			</Grid>
		</footer>
	);
};
export default Footer;
