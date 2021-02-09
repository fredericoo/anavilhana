import styles from "./WatchLink.module.scss";
import { hrefResolver } from "prismic-configuration";
import Button from "components/Button/Button";

const WatchLink = ({ platform, link }) => (
	<Button type="primary" href={hrefResolver(link)}>
		<span target="_blank" className={`${styles.platform} h-3`}>
			{platform}
		</span>
	</Button>
);

export default WatchLink;
