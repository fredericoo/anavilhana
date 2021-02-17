import styles from "./WatchLink.module.scss";
import { hrefResolver } from "prismic-configuration";
import Link from "next/link";

const WatchLink = ({ platform, link }) => (
	<Link href={hrefResolver(link)}>
		<a target="_blank" className={`${styles.platform} h-3`}>
			<svg
				className={styles.icon}
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
			{platform}
		</a>
	</Link>
);

export default WatchLink;
