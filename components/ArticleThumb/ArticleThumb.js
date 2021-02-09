import styles from "./ArticleThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import Text from "components/Text/Text";
import useTranslation from "next-translate/useTranslation";

const ArticleThumb = ({ article }) => {
	const { t } = useTranslation();

	return (
		<Link href={hrefResolver(article.data.link)}>
			<a target="_blank" className={styles.article}>
				<div className={`${styles.source} smcp`}>{article.data.fonte}</div>
				<h3 className={`h-3 ${styles.title}`}>
					<Text asText content={article.data.titulo} />
				</h3>
				<div className={`${styles.lead} s-sm`}>
					<Text content={article.data.bigode} />
				</div>
				<div className={`${styles.cta} smcp`}>{t("common:ler")}</div>
			</a>
		</Link>
	);
};

export default ArticleThumb;
