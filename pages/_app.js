import "styles/globals.scss";
import { useRouter } from "next/router";
import moment from "moment";
import { DocumentsProvider } from "utils/hooks/useDocuments";
import GoogleAnalytics from "components/GoogleAnalytics/GoogleAnalytics";

function App({ Component, pageProps }) {
	const { locale } = useRouter();
	moment.locale(locale);

	return (
		<DocumentsProvider>
			<GoogleAnalytics />
			<Component {...pageProps} />
		</DocumentsProvider>
	);
}

export default App;
