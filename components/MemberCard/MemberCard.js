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
					{position && <div>{position}</div>}
				</div>
				<button type="button" className={styles.more}>
					+
				</button>
			</a>
		</Link>
	);
};

export default MemberCard;
