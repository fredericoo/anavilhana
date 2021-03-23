import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import FilmHero from "components/FilmHero/FilmHero";
import CalendarSection from "components/CalendarSection/CalendarSection";
import { Client } from "utils/prismicHelpers";
import Banner from "components/Banner/Banner";
import { hrefResolver } from "prismic-configuration";

export default function Home({ home, config }) {
	return (
		<Layout config={config}>
			<Meta />
			{home?.data?.highlights && (
				<FilmHero
					filmes={home.data.highlights.map((highlight) => highlight.filme)}
				/>
			)}
			<CalendarSection />
			{home?.data?.banner_texto && (
				<Banner
					text={home.data.banner_texto}
					cta={home.data.banner_cta}
					url={hrefResolver(home.data.banner_url)}
					background={home.data.banner_bg}
					textColour={
						home.data.banner_textcolour === "branco"
							? "var(--colour__bg)"
							: "var(--colour__main)"
					}
				/>
			)}
		</Layout>
	);
}

export async function getStaticProps({ locale }) {
	const client = Client();
	const home = await client.getSingle("home", {
		lang: locale,
		fetchLinks: [
			"filme.titulo",
			"filme.lancamento",
			"filme.imagens",
			"filme.ficha_tecnica",
			"membro.nome",
		],
	});
	const config = await client.getSingle("config", {
		lang: locale,
	});
	if (home && config) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				home: home || {},
			},
		};
	}
	return { revalidate: 600, props: { home: {}, config: {} } };
}
