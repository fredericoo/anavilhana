import styles from "./PageHeader.module.scss";

const PageHeader = ({ children }) => {
	return <header className={styles.header}>{children}</header>;
};

export default PageHeader;
