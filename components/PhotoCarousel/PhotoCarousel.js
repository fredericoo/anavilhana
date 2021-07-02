import styles from "./PhotoCarousel.module.scss";
import Placeholder from "components/Placeholder/Placeholder";
import { useState, useMemo } from "react";

const PhotoCarousel = ({ photos }) => {
	if (typeof photos != "object" || !photos.length || !photos[0].imagem1?.url)
		return null;

	const images = useMemo(() => photos.filter((photo) => photo.imagem1.url), [
		photos,
	]);

	const [slideIndex, setSlideIndex] = useState(0);

	const changeSlide = (slideNo) => {
		setSlideIndex(slideNo);
	};

	const displaySlides = {
		previous: slideIndex <= 0 ? images.length - 1 : slideIndex - 1,
		current: slideIndex,
		next: slideIndex + 1 >= images.length ? 0 : slideIndex + 1,
	};

	return (
		<div className={`${styles.section} grid grid--full`}>
			<CarouselSlide
				key={"prev" + images[displaySlides.previous].imagem1.url}
				photo={images[displaySlides.previous].imagem1}
				onClick={() => changeSlide(displaySlides.previous)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="butt"
					strokeLinejoin="arcs"
				>
					<path d="M19 12H6M12 5l-7 7 7 7" />
				</svg>
			</CarouselSlide>
			<CarouselSlide
				key={images[displaySlides.current].imagem1.url}
				photo={images[displaySlides.current].imagem1}
			/>
			<CarouselSlide
				key={"next" + images[displaySlides.next].imagem1.url}
				onClick={() => changeSlide(displaySlides.next)}
				photo={images[displaySlides.next].imagem1}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="butt"
					strokeLinejoin="arcs"
				>
					<path d="M5 12h13M12 5l7 7-7 7" />
				</svg>
			</CarouselSlide>
			<div className={`${styles.slideNo}`}>
				{" "}
				{slideIndex + 1} / {images.length}
			</div>
		</div>
	);
};

const CarouselSlide = ({ photo, onClick, children }) => {
	if (!photo.url) return null;
	const photoProps = onClick
		? { layout: "fill", objectFit: "cover" }
		: {
				objectFit: "contain",
				objectPosition: "center",
				layout: "fill",
		  };
	return (
		<figure
			className={`${styles.slide} ${onClick ? styles.interactive : ""}`}
			onClick={onClick}
		>
			{children}
			<Placeholder src={photo.url} {...photoProps} alt={photo.alt} />
		</figure>
	);
};

export default PhotoCarousel;
