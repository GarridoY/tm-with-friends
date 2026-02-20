// Trackmania map names can contain control characters for styling, this function removes them for better display.
// These are only present when interacting with the Server service API from Nadeo.
export function translateTextStyling(text: string) {
	const controlCharacterRegex = /\$(w|n|o|i|t|s|g|z|\$)/g;
	const colorRegex = /\$(0|1|2|3|4|5|6|7|8|9|a|A|b|B|c|C|d|D|e|E|f|F){3}/g;
	return text.replaceAll(controlCharacterRegex, "").replaceAll(colorRegex, "");
}