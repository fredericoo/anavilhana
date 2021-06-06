import "styles/globals.scss";
import { useRouter } from "next/router";
import moment from "moment";
import { DocumentsProvider } from "utils/hooks/useDocuments";

function App({ Component, pageProps }) {
	const { locale } = useRouter();
	moment.locale(locale);

	return (
		<DocumentsProvider>
			<Component {...pageProps} />
		</DocumentsProvider>
	);
}

export default App;
