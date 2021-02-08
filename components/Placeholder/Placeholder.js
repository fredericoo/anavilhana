import Image from "next/image";
import { useState } from "react";
import styles from "./Placeholder.module.scss";

const Placeholder = (props) => {
	if (!props.src) return null;
	const [loaded, setLoaded] = useState(false);
	return (
		<div
			className={`${styles.placeholder} ${
				props.layout && props.layout === "fill" ? styles.fill : ""
			} ${loaded ? styles.loaded : ""}`}
		>
			<Image
				objectFit="cover"
				className={`${styles.image} ${loaded ? styles.loaded : ""}`}
				{...props}
				src={props.src.replace("auto=compress,format", "")}
				onLoad={() => setLoaded(true)}
				quality={90}
			/>
		</div>
	);
};

export default Placeholder;
