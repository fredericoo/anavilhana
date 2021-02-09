import { useState } from "react";
import useTranslation from "next-translate/useTranslation";

import styles from "./CriticsSection.module.scss";

import ArticleThumb from "components/ArticleThumb/ArticleThumb";
import Columns from "components/Columns/Columns";
import Button from "components/Button/Button";

const CriticsSection = ({ articles }) => {
	const [show, setShow] = useState(3);
	const { t } = useTranslation();
	const showMore = () => {
		setShow(articles.length);
	};

	return (
		<>
			<Columns sm={1} md={2} lg={3}>
				{articles &&
					articles
						.slice(0, show)
						.map((article, key) => (
							<ArticleThumb key={article.id + key} article={article} />
						))}
			</Columns>
			{show < articles.length && (
				<div className={styles.showMore}>
					<Button type="link" onClick={showMore}>
						{t("common:mais")} ({articles.length})
					</Button>
				</div>
			)}
		</>
	);
};

export default CriticsSection;
