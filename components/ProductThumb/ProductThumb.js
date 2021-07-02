import styles from "./ProductThumb.module.scss";
import Link from "next/link";
import { hrefResolver } from "prismic-configuration";
import Text from "components/Text/Text";
import Placeholder from "components/Placeholder/Placeholder";

const ProductThumb = ({ product }) => {
	if (!product.data) return null;
	return (
		<Link href={hrefResolver(product)}>
			<a className={styles.module}>
				{product.data.imagem?.url && (
					<Placeholder
						src={product.data.imagem.url}
						width={product.data.imagem.dimensions.width}
						height={product.data.imagem.dimensions.height}
						alt={product.data.imagem.alt}
					/>
				)}
				<h3 className={`h-3 ${styles.title}`}>
					<Text asText content={product.data.titulo} />
				</h3>
				{product.data.sobre && (
					<div className={`${styles.lead} s-sm`}>
						<Text content={product.data.sobre} />
					</div>
				)}
			</a>
		</Link>
	);
};

export default ProductThumb;
