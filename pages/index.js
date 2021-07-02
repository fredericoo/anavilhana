import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import FilmHero from "components/FilmHero/FilmHero";
import CalendarSection from "components/CalendarSection/CalendarSection";
import { Client } from "utils/prismicHelpers";
import Banner from "components/Banner/Banner";
import { hrefResolver } from "prismic-configuration";
import Flickity from "react-flickity-component";

export default function Home({ home, config }) {
	if (!home?.data) return null;

	return (
		<Layout config={config}>
			<Meta />
			{home.data.highlights && (
				<FilmHero
					filmes={home.data.highlights.map((highlight) => highlight.filme)}
				/>
			)}
			<CalendarSection />
			<Flickity options={{ autoPlay: true }} disableImagesLoaded={true} static>
				{home.data.banners
					?.filter((entry) => entry.banner_texto)
					.map((entry) => (
						<Banner
							text={entry.banner_texto}
							cta={entry.banner_cta}
							url={hrefResolver(entry.banner_url)}
							background={entry.banner_bg}
							textColour={
								entry.banner_textcolour === "branco"
									? "var(--colour__bg)"
									: "var(--colour__main)"
							}
						/>
					))}
			</Flickity>
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
