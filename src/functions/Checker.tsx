import { setting, tahan } from "../types/types";
import Notify from "./Notify";

const Checker = (
	tahanData: tahan[] | setting[],
	settingsData: setting[] | tahan[],
) => {
	tahanData.map((field) => {
		const compare = (includes: string, field: any, offset: number = 0) => {
			// Gets current setting
			const returnVal = (index: number) => {
				return settingsData[index]["value"];
			};

			// Array containing messages
			const messages = [
				"Too hot! Turning AC on",
				"Too Cold! Turning AC off",
				"Too humid!, stopping sprinklers!",
				"Too dry!, turning on Sprinklers",
				"Too bright! Closing shutters",
				"Too dim!, Opening shutters",
			];

			/* 				Checks if the name of the field matches and then compares the value of that field with the setting */
			if (field.name.includes(includes)) {
				if (field.value > returnVal(0 + offset)) {
					Notify(`${messages[0 + offset]} for ${field.name}`);
					console.log("High");
					return;
				} else if (field.value < returnVal(1 + offset)) {
					Notify(`${messages[1 + offset]} for ${field.name}`);
					console.log("Low");
					return;
				} else {
					return;
				}
			}
		};

		// Calls the compare functios
		compare("Temp", field);
		compare("Humidity", field, 2);
		compare("Light", field, 4);
	});
};

export default Checker;
