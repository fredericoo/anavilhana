import { RichText } from "prismic-reactjs";

const Text = ({ content, asText }) => {
	return (
		<>
			{typeof content === "object" ? (
				asText ? (
					RichText.asText(content)
				) : (
					<RichText render={content} />
				)
			) : (
				{ content }
			)}
		</>
	);
};
export default Text;
