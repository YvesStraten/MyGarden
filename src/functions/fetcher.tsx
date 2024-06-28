import { Setting, Tahan } from "../types/types";

const fetcher = async () => {
	const newData: Array<Tahan> = [];
	const settings: Array<Setting> = [];
	await fetch(
		"https://api.thingspeak.com/channels/2400298/feeds.json?api_key=SVWPDJG7Y4WJZUKX&results=1",
	).then(async (res) => {
		const data = await res.json();

		// Gets the number of fields
		let size = Object.keys(data["feeds"][0]).length - 2;

		for (let i = 1; i <= size; i++) {
			// Generate random id for each field
			const id = crypto.randomUUID();

			// Gets the field values and rounds them
			const field = data["feeds"][0][`field${i}`];
			const rounded = parseFloat(field);

			// Field name
			const fieldName = data["channel"][`field${i}`];
			const graphLink = `https://thingspeak.com/channels/2400298/charts/${i}?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&api_key=SVWPDJG7Y4WJZUKX`;
			newData.push({
				id: id,
				name: fieldName,
				value: rounded,
				graph: graphLink,
			});
		}
	});
	await fetch(
		"https://api.thingspeak.com/channels/2404379/feeds.json?api_key=NEFL69N7VTI5YCX1&results=1",
	).then(async (res) => {
		const data = await res.json();
		let size = Object.keys(data["feeds"][0]).length - 2;

		for (let i = 1; i <= size; i++) {
			const settingName = data["channel"][`field${i}`];
			const settingValue = data["feeds"][0][`field${i}`];

			settings.push({
				setting: settingName,
				value: Number(settingValue),
			});
		}
	});
	return [newData, settings] as const;
};

export default fetcher;
