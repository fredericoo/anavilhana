import styles from "./Grid.module.scss";

const Grid = ({ gap = "2rem", container, children, className }) => {
	return (
		<div
			className={`${styles.grid} ${container ? styles.container : ""} ${
				className ? className : ""
			} `}
			style={{ "--gap": gap }}
		>
			{children}
		</div>
	);
};

const Col = ({
	children,
	className,
	id,
	sm = "grid-start / grid-end",
	md,
	lg,
	xl,
	rowSm = "auto",
	rowMd,
	rowLg,
	rowXl,
	zIndex,
}) => {
	const style = {
		"--colSm": sm,
		"--colMd": md,
		"--colLg": lg,
		"--colXl": xl,
		"--rowSm": rowSm,
		"--rowMd": rowMd,
		"--rowLg": rowLg,
		"--rowXl": rowXl,
		"--zIndex": zIndex,
	};

	return (
		<div
			id={id}
			className={`${className ? className : ""} ${styles.col}`}
			style={style}
		>
			{children}
		</div>
	);
};

Grid.Col = Col;
export default Grid;
