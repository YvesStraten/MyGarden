import { Data, Setting } from "../bindings";
import notify from "./notify";

// TODO: Fix these types
const checker = (tahanData: Array<Data>, settingsData: Array<Setting>) => {
  tahanData.map((field: Data) => {
    const compare = (includes: string, field: Data, offset: number = 0) => {
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
          notify(`${messages[0 + offset]} for ${field.name}`);
          return;
        } else if (field.value < returnVal(1 + offset)) {
          notify(`${messages[1 + offset]} for ${field.name}`);
          return;
        } else {
          return;
        }
      }
    };

    // Calls the compare functions
    compare("Temp", field);
    compare("Humidity", field, 2);
    compare("Light", field, 4);
  });
};

export default checker;
