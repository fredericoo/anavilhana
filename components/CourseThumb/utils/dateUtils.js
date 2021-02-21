import moment from "moment";

export const formatDateRange = (date1, date2, formats) => {
	const start = moment(date1);
	const end = moment(date2);
	const output = { start: [], joint: [], end: [] };

	let sameDate = true;
	formats.forEach((format) => {
		output.end.unshift(format(end));
		if (format(start) !== format(end) || !sameDate) {
			output.start.unshift(format(start));
			sameDate = false;
		}
	});

	if (!sameDate) output.joint.unshift("—");

	return [...output.start, ...output.joint, ...output.end].join(" ");
};
