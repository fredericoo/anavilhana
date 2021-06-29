import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const GTAG = "GTM-WXKMP4L";

const GoogleAnalytics = () => {
	const router = useRouter();

	const handleRouteChange = (url) => {
		gtag("config", GTAG, {
			page_path: url,
		});
	};

	useEffect(() => {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function gtag() {
			window.dataLayer.push(arguments);
		};
		window.gtag("js", new Date());
		window.gtag("config", GTAG);
	}, []);

	useEffect(() => {
		router.events.on("routeChangeComplete", handleRouteChange);
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);

	return (
		<Head>
			<script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${GTAG}`}
			></script>
		</Head>
	);
};

export default GoogleAnalytics;
