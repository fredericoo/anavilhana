import styles from "./Flow.module.scss";

const Flow = ({
	className,
	spacing = "1rem",
	horizontal = false,
	children,
}) => (
	<div
		style={{ "--flow__spacing": spacing }}
		className={`${styles.flow} ${horizontal && styles.horizontal} ${
			className ? classname : ""
		}`}
	>
		{children}
	</div>
);

export default Flow;
