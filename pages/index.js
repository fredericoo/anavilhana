import Layout from "components/Layout/Layout";
import Meta from "components/Meta/Meta";
import FilmHero from "components/FilmHero/FilmHero";
import { queryRepeatableDocuments } from "utils/queries";
import CalendarSection from "components/CalendarSection/CalendarSection";
import { Client } from "utils/prismicHelpers";
import Banner from "components/Banner/Banner";
import { hrefResolver } from "prismic-configuration";

export default function Home({ home, docs, config }) {
	return (
		<Layout config={config}>
			<Meta />
			<FilmHero filmes={docs} />
			<CalendarSection filmes={docs} />
			{home && home.data.banner_texto && (
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
	const documents = await queryRepeatableDocuments(
		(doc) => doc.type === "filme" && doc.lang === locale
	);

	const client = Client();
	const home = await client.getSingle("home", { lang: locale });
	const config = await client.getSingle("config", { lang: locale });

	if (documents) {
		return {
			revalidate: 60,
			props: {
				config: config || {},
				home: home || {},
				docs: documents || {},
			},
		};
	}
	return { revalidate: 600, props: { home: {}, config: {}, docs: {} } };
}
