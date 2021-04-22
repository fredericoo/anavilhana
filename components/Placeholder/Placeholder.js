import Image from "next/image";
import { useState } from "react";
import styles from "./Placeholder.module.scss";

const Placeholder = ({ style, ...props }) => {
	if (!props || !props.src) return null;
	const [loaded, setLoaded] = useState(false);
	const handleLoad = (e) => {
		if (e.target.src.indexOf("data:image/gif;base64") < 0) {
			setLoaded(true);
		}
	};
	return (
		<div
			style={style}
			className={`${styles.placeholder} ${loaded ? styles.loaded : ""} ${
				props.layout === "fill" ? styles.fill : ""
			}`}
		>
			<Image
				objectFit="cover"
				className={`${styles.image} ${loaded ? styles.loaded : ""}`}
				{...props}
				src={props.src.replace("auto=compress,format", "")}
				onLoad={handleLoad}
				quality={90}
			/>
		</div>
	);
};

export default Placeholder;
