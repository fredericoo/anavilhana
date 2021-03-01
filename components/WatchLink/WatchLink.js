import styles from "./WatchLink.module.scss";
import { hrefResolver } from "prismic-configuration";
import Link from "next/link";

const WatchLink = ({ platform, subtitle, link, size = "md" }) => {
	const headingSizes = { sm: "h-4", md: "h-3", lg: "h-2" };
	const linkTo = typeof link === "object" ? hrefResolver(link) : link;
	return (
		<Link href={linkTo}>
			<a target="_blank" className={styles.platform}>
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
					<circle cx="12" cy="12" r="10"></circle>
					<polygon points="10 8 16 12 10 16 10 8"></polygon>
				</svg>
				<div>
					{subtitle && <p className="smcp s-xs">{subtitle}</p>}
					<h3 className={`${headingSizes[size] ? headingSizes[size] : "h-3"}`}>
						{platform}
					</h3>
				</div>
			</a>
		</Link>
	);
};

export default WatchLink;
