export const uniqueOptions = (array, callback) => {
	if (!Array.isArray(array)) return [];
	return Array.from(new Set(array.map(callback))).filter(
		(item) => item && item.length
	);
};
