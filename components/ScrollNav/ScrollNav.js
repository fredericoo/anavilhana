import styles from "./ScrollNav.module.scss";
import { useState, useEffect } from "react";
import animateScrollTo from "animated-scroll-to";

const ScrollNav = ({ items }) => {
	const [activeNav, setActiveNav] = useState();
	const [navItems, setNavItems] = useState([]);

	useEffect(() => {
		setNavItems(
			items
				.filter((item) => document.querySelector(`#${item.id}`)) // elements that don't exist are purged off.
				.map(({ label, id }) => ({
					label,
					ref: document.querySelector(`#${id}`), // creates the 'ref' inside the navItems state with the query.
				}))
		);
	}, []);

	const handleScroll = () => {
		let active = null;
		navItems.forEach(({ ref }) => {
			const rect = ref.getBoundingClientRect();
			if (rect.top <= window.innerHeight / 2) active = ref;
		});
		setActiveNav(active);
	};

	useEffect(() => {
		handleScroll();
		document.addEventListener("scroll", () => handleScroll());
		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, [navItems]);

	const scrollTo = (element) => {
		animateScrollTo(element, { verticalOffset: -100 });
	};

	return (
		<ul className={styles.list}>
			<li className={`smcp ${styles.title}`}>Índice</li>
			{navItems.map(({ ref, label }, key) => (
				<li key={key}>
					<button
						onClick={() => scrollTo(ref)}
						type="button"
						className={`smcp ${styles.item} ${
							ref === activeNav ? styles.active : ""
						}`}
					>
						{label || "missing label"}
					</button>
				</li>
			))}
		</ul>
	);
};

export default ScrollNav;
