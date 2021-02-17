import styles from "./ScrollNav.module.scss";
import { useState, useEffect, useRef } from "react";
import animateScrollTo from "animated-scroll-to";

const ScrollNav = ({ items }) => {
	const [activeNav, setActiveNav] = useState();
	const [navItems, setNavItems] = useState([]);
	const [overlay, setOverlay] = useState(false);

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
		if (active !== activeNav) setActiveNav(active);
	};

	const handleOverlay = (entries, observer) => {
		let overlay = false;
		entries.forEach((entry) => {
			console.log(entry, observer);
			if (entry.isIntersecting) overlay = true;
		});
		setOverlay(overlay);
	};

	useEffect(() => {
		handleScroll();
		document.addEventListener("scroll", () => handleScroll());

		const observer = new window.IntersectionObserver(handleOverlay, {
			root: null,
			threshold: [0.5],
		});
		navItems
			.filter(({ ref }) => ref.dataset.hidenav)
			.forEach(({ ref }) => observer.observe(ref));

		return () => {
			document.removeEventListener("scroll", handleScroll);
			observer.disconnect();
		};
	}, [navItems]);

	const scrollTo = (element) => {
		animateScrollTo(element, { verticalOffset: -100 });
	};

	return (
		<ul className={`${styles.list} ${overlay ? styles.hidden : ""}`}>
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
