import styles from "./PhotoCarousel.module.scss";
import Placeholder from "components/Placeholder/Placeholder";
import { useState } from "react";

const PhotoCarousel = ({ photos }) => {
	if (typeof photos != "object" || !photos.length || !photos[0].imagem1.url)
		return null;

	const [slideIndex, setSlideIndex] = useState(0);

	const changeSlide = (slideNo) => {
		setSlideIndex(slideNo);
	};

	const displaySlides = {
		previous: slideIndex <= 0 ? photos.length - 1 : slideIndex - 1,
		current: slideIndex,
		next: slideIndex + 1 >= photos.length ? 0 : slideIndex + 1,
	};

	return (
		<div className={`${styles.section} grid grid--full`}>
			<CarouselSlide
				photo={photos[displaySlides.previous].imagem1}
				onClick={() => changeSlide(displaySlides.previous)}
			/>
			<CarouselSlide photo={photos[displaySlides.current].imagem1} />
			<CarouselSlide
				onClick={() => changeSlide(displaySlides.next)}
				photo={photos[displaySlides.next].imagem1}
			/>
			<div className={`${styles.slideNo}`}>
				{" "}
				{slideIndex + 1} / {photos.length}
			</div>
		</div>
	);
};

const CarouselSlide = ({ photo, onClick }) => {
	if (!photo.url) return null;
	const photoProps = onClick
		? { layout: "fill" }
		: {
				width: photo.dimensions.width,
				height: photo.dimensions.height,
				layout: "responsive",
		  };
	return (
		<figure
			className={`${styles.slide} ${onClick ? styles.interactive : ""}`}
			onClick={onClick}
		>
			<Placeholder src={photo.url} {...photoProps} alt={photo.alt} />
		</figure>
	);
};

export default PhotoCarousel;
