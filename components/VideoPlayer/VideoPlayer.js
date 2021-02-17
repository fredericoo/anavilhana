import styles from "./VideoPlayer.module.scss";

const VideoPlayer = ({ html, height, width }) => (
	<div
		className={styles.wrapper}
		style={{
			"--aspectRatio": width / height,
		}}
		dangerouslySetInnerHTML={{ __html: html }}
	/>
);

export default VideoPlayer;
