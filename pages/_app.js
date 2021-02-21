import "styles/globals.scss";
import { useRouter } from "next/router";
import moment from "moment";

function App({ Component, pageProps }) {
	const { locale } = useRouter();
	moment.locale(locale);

	return <Component {...pageProps} />;
}

export default App;
