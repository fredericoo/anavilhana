import styles from "./VideoPlayer.module.scss";
import { forwardRef } from "react";

const VideoPlayer = forwardRef(
	({ html, src, videoProps, height, width, layout }, ref) => {
		const wrapperClass = `${styles.wrapper} ${
			layout === "fill" ? styles.fill : styles.responsive
		}`;
		if (html) {
			return (
				<div
					className={wrapperClass}
					style={{
						"--aspectRatio": width / height,
					}}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			);
		}
		if (src) {
			return (
				<div
					className={wrapperClass}
					style={{
						"--aspectRatio": width / height,
					}}
				>
					<video ref={ref} {...videoProps}>
						<source src={src} type={`video/${src.match(/\.([^.]+)$/)[1]}`} />
					</video>
				</div>
			);
		}
		return null;
	}
);

export default VideoPlayer;
