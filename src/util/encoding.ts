export const decodeHtmlEntity = (x: string): string => {
	return x.replace(/&#(\d+);/g, function (match, dec) {
		return String.fromCharCode(dec);
	});
};