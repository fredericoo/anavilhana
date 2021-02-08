import { Client } from "utils/prismicHelpers";
import Layout from "components/Layout/Layout";
import styles from "styles/pages/sobre.module.scss";
import Placeholder from "components/Placeholder/Placeholder";
import { RichText } from "prismic-reactjs";
import Columns from "components/Columns/Columns";
import MemberCard from "components/MemberCard/MemberCard";
import { hrefResolver } from "prismic-configuration";
import Meta from "components/Meta/Meta";

const Sobre = ({ sobre, config }) => {
	return (
		<Layout config={config}>
			{sobre && sobre.data && (
				<>
					<Meta
						pageTitle={RichText.asText(sobre.data.titulo)}
						pageDesc={RichText.asText(sobre.data.corpo)}
						pageImage={sobre.data.imagem && sobre.data.imagem.url}
					/>
					<section className={`${styles.sobre} grid grid--full`}>
						{sobre.data.imagem && sobre.data.imagem.url && (
							<div className={styles.image}>
								<Placeholder
									src={sobre.data.imagem.url}
									width={sobre.data.imagem.dimensions.width}
									height={sobre.data.imagem.dimensions.height}
									alt={sobre.data.imagem.alt}
									layout="responsive"
									sizes="(max-width: 768px) 600px,
								(max-width: 1920px) 600px,
								1200px"
								/>
							</div>
						)}
						<div className={`${styles.body} body`}>
							<h1 className={`h-2`}>{RichText.asText(sobre.data.titulo)}</h1>
							<RichText render={sobre.data.corpo} />
						</div>
					</section>
					<section className={`${styles.membros} grid grid--inner`}>
						<div className={`${styles.body} body`}>
							<h2 className={`h-1`}>
								{RichText.asText(sobre.data.equipe_titulo)}
							</h2>
							<RichText render={sobre.data.equipe_corpo} />
						</div>
						<Columns className={styles.list} sm={2} md={3} lg={4}>
							{sobre.data.equipe.map((equipe) => (
								<MemberCard
									key={equipe.membro.uid}
									name={equipe.membro.data.nome}
									position={equipe.membro.data.posicao}
									photo={equipe.membro.data.imagem}
									link={hrefResolver(equipe.membro)}
								/>
							))}
						</Columns>
					</section>
				</>
			)}
		</Layout>
	);
};

export default Sobre;

export async function getStaticProps({ locale }) {
	const client = Client();
	const sobre = await client.getSingle("sobre", {
		lang: locale,
		fetchLinks: ["membro.nome", "membro.imagem", "membro.posicao"],
	});
	const config = await client.getSingle("config", { lang: locale });

	if (sobre && config) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				sobre: sobre || {},
			},
		};
	}
	return { revalidate: 600, props: { sobre: {}, config: {} } };
}
