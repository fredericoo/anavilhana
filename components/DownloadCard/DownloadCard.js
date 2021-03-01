import styles from "./DownloadCard.module.scss";
import { hrefResolver } from "prismic-configuration";
import Link from "next/link";

const DownloadCard = ({ title, subtitle, link, size = "md" }) => {
	const headingSizes = { sm: "h-4", md: "h-3", lg: "h-2" };
	const linkTo = typeof link === "object" ? hrefResolver(link) : link;
	return (
		<Link href={linkTo}>
			<a target="_blank" className={styles.title}>
				<svg
					className={`${styles.icon} ${
						headingSizes[size] ? headingSizes[size] : "h-3"
					}`}
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="butt"
					strokeLinejoin="arcs"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M16 12l-4 4-4-4M12 8v7" />
				</svg>
				<div>
					<h3 className={`${headingSizes[size] ? headingSizes[size] : "h-3"}`}>
						{title}
					</h3>
					{subtitle && <p className="smcp s-xs l-2">{subtitle}</p>}
				</div>
			</a>
		</Link>
	);
};

export default DownloadCard;
