import styles from "./MemberCard.module.scss";
import Link from "next/link";
import Text from "components/Text/Text";
import Placeholder from "components/Placeholder/Placeholder";

const MemberCard = ({ name, position, photo, link }) => {
	if (typeof link !== "string") return false;

	return (
		<Link href={link}>
			<a className={styles.card}>
				{photo && (
					<div className={styles.image}>
						<Placeholder
							src={photo.url}
							alt={photo.alt}
							width={1200}
							height={1400}
							layout="responsive"
							sizes="(max-width: 768px) 150px,
								(max-width: 1920px) 300px,
								600px"
						/>
					</div>
				)}
				<div className={styles.info}>
					<h3 className={`h-3`}>
						<Text asText content={name} />
					</h3>
					{position && <div className={styles.position}>{position}</div>}
				</div>
				<svg
					className={styles.more}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="butt"
					strokeLinejoin="arcs"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="16"></line>
					<line x1="8" y1="12" x2="16" y2="12"></line>
				</svg>
			</a>
		</Link>
	);
};

export default MemberCard;
