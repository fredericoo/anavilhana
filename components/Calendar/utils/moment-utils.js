const moment = require("moment");

export const getSpecificDate = (month, dayOfMonth, year) => {
	return moment(`${month}-${dayOfMonth}-${year}`, "MM-DD-YYYY").toDate();
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

export const getDayOfMonth = (date) => zeroPad(moment(date).date(), 2);

export const getMonth = (date) => moment(date).month();

export const getYear = (date) => moment(date).year();

export const getToday = () => moment().toDate();

export const getReadableWeekday = (date) => moment(date).format("dddd");

export const getReadableMonthDate = (date) => moment(date).format("MMMM Do");

export const getMonthDayYear = (date) => moment(date).format("MM-DD-YYYY");
