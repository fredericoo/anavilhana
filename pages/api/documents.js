import { queryRepeatableDocuments } from "utils/queries";

export default async (req, res) => {
	const docs = await queryRepeatableDocuments((doc) => doc.uid);

	res.statusCode = 200;
	res.setHeader("Cache-Control", "s-maxage=6000, stale-while-revalidate");
	res.json(docs);
};
