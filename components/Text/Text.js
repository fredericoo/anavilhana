import { RichText } from "prismic-reactjs";

const Text = ({ content, asText }) => {
	if (typeof content === "object") {
		if (asText) return RichText.asText(content);
		return <RichText render={content} />;
	}
	if (typeof content === "string") {
		return <>{content}</>;
	}
	console.warn("something went wrong when displaying <Text/>");
	return null;
};
export default Text;
