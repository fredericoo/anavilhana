import styles from "./CourseThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import Text from "components/Text/Text";
import { groupHasItems } from "utils/prismicHelpers";
import { formatDateRange } from "./utils/dateUtils";
import Columns from "components/Columns/Columns";
import Placeholder from "components/Placeholder/Placeholder";

const CourseThumb = ({ course }) => {
	return (
		<Link href={hrefResolver(course)}>
			<a className={styles.module}>
				{course.data.imagem?.url && (
					<Placeholder
						src={course.data.imagem.url}
						width={course.data.imagem.dimensions.width}
						height={course.data.imagem.dimensions.height}
						alt={course.data.imagem.alt}
					/>
				)}
				<div className={`${styles.type} smcp`}>{course.data.tipo}</div>
				<h3 className={`h-3 ${styles.title}`}>
					<Text asText content={course.data.titulo} />
				</h3>
				{course.data.resumo && (
					<div className={`${styles.lead} s-sm`}>
						<Text content={course.data.resumo} />
					</div>
				)}
				<Columns sm={2} className={styles.footer}>
					{course.data.preco && (
						<div className={styles.price}>{course.data.preco}</div>
					)}
					{groupHasItems(course.data.datas) && (
						<ul className={styles.dates}>
							{course.data.datas.map((range, key) => (
								<li key={key} className={styles.date}>
									{formatDateRange(range.inicio, range.final, [
										(date) => date.format("YYYY"),
										(date) => date.format("MMM"),
										(date) => date.format("DD"),
									])}
								</li>
							))}
						</ul>
					)}
				</Columns>
			</a>
		</Link>
	);
};

export default CourseThumb;
