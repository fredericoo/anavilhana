import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";

export const Layout = ({ config, children }) => {
	return (
		<>
			<Navbar menu={config && config.data.menu} />
			<main>{children}</main>
			<Footer config={config} />
		</>
	);
};

export default Layout;
