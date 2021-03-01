import styles from "./ScrollNav.module.scss";
import { useState, useEffect, useRef } from "react";
import animateScrollTo from "animated-scroll-to";

const ScrollNav = ({ items }) => {
	const [activeNav, setActiveNav] = useState("");
	const [navItems, setNavItems] = useState([]);
	const [overlay, setOverlay] = useState(false);
	const navRef = useRef();

	useEffect(() => {
		setNavItems(
			items
				.filter((item) => document.querySelector(`#${item.id}`)) // elements that don't exist are purged off.
				.map(({ label, id }) => ({
					label,
					id,
					ref: document.querySelector(`#${id}`), // creates the 'ref' inside the navItems state with the query.
				}))
		);
	}, []);

	const handleOverlay = (entries, _) => {
		let overlay = false;
		entries.forEach((entry) => {
			if (entry.isIntersecting) overlay = true;
		});
		setOverlay(overlay);
	};

	useEffect(() => {
		if (navRef.current && !!activeNav.length) {
			const selectedOption = navRef.current.querySelector(
				`li[data-scroll=${activeNav}]`
			);
			animateScrollTo(selectedOption, {
				horizontalOffset: window.innerWidth / -2,
				elementToScroll: navRef.current,
			});
		}
	}, [activeNav]);

	useEffect(() => {
		if (typeof window === "undefined") return () => {};
		let observer;
		const handleScroll = () => {
			let active = null;
			navItems.forEach(({ ref, id }) => {
				const rect = ref.getBoundingClientRect();
				if (rect.top <= window.innerHeight / 2) active = id;
			});
			if (active && active !== activeNav) {
				setActiveNav(active);
			}
		};
		if (!!navItems.length) {
			handleScroll();
			window.addEventListener("scroll", () => handleScroll());
			observer = new window.IntersectionObserver(handleOverlay, {
				root: null,
				threshold: [0.5],
			});
			navItems
				.filter(({ ref }) => ref.dataset.hidenav)
				.forEach(({ ref }) => observer.observe(ref));
		}

		return () => {
			if (!!navItems.length) {
				console.log("removing listener");
				window.removeEventListener("scroll", handleScroll);
				observer.disconnect();
			}
		};
	}, [navItems]);

	const scrollTo = (element) => {
		animateScrollTo(element, { verticalOffset: -100 });
	};

	return (
		<ul
			ref={navRef}
			className={`${styles.list} ${overlay ? styles.hidden : ""}`}
		>
			{navItems.map(({ ref, id, label }, key) => (
				<li data-scroll={id} key={key}>
					<button
						onClick={() => scrollTo(ref)}
						type="button"
						className={`smcp ${styles.item} ${
							id === activeNav ? styles.active : ""
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
