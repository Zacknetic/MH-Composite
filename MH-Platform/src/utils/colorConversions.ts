export function convertCCTValueToDualWhite(_cctValue) {
	const cctValue = _cctValue - 140;
	let multiplier = 0;
	const CCT = { warmWhite: 0, coldWhite: 0 };

	const threshold = 110;
	if (cctValue >= threshold) {
		CCT.warmWhite = 127;
		multiplier = (1 - ((cctValue - threshold) / (360 - threshold)));
		CCT.coldWhite = Math.round((127 * multiplier));
	} else {
		CCT.coldWhite = 127;
		multiplier = (cctValue / threshold);
		CCT.warmWhite = Math.round((127 * multiplier));
	}
	return CCT;
}