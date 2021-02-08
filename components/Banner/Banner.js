import styles from "./Banner.module.scss";
import Button from "components/Button/Button";
import Text from "components/Text/Text";
import Placeholder from "components/Placeholder/Placeholder";

const Banner = ({ heading = 1, text, cta, url, background, textColour }) => {
	return (
		<section
			className={`${styles.section} grid grid--full`}
			style={{ "--textColour": textColour }}
		>
			<header className={styles.textBlock}>
				<h2 className={`${styles.heading} h-${heading}`}>
					<Text content={text} />
				</h2>
				<Button type="link" href={url}>
					{cta}
				</Button>
			</header>
			{background && (
				<div className={styles.background}>
					<Placeholder src={background.url} layout="fill" />
				</div>
			)}
		</section>
	);
};
export default Banner;
