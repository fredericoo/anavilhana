import { createContext, useState, useEffect, useContext } from "react";
import { fetchDocs } from "../queries";

const Documents = createContext([]);

export const DocumentsProvider = ({ children }) => {
	const [documents, setDocuments] = useState([]);

	useEffect(async () => {
		const fetched = await fetchDocs();
		fetched && setDocuments(fetched);
	}, []);

	return <Documents.Provider value={documents}>{children}</Documents.Provider>;
};

export const useDocuments = () => {
	return useContext(Documents);
};
