export const uniqueOptions = (array, callback) =>
	Array.from(new Set(array.map(callback))).filter((item) => !!item.length);
