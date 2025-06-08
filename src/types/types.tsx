import { Data, Setting } from "../bindings";

export type dashboard = {
  tahanData: Data[];
  settingsData: Setting[];
};

// export type checker = {
//   tahanData: Tahan[];
//   settingsData: Setting[];
// };

export type formtype = {
  maxtemp: string;
  maxhumid: string;
  maxlight: string;

  mintemp: string;
  minhumid: string;
  minlight: string;
};

export type display = {
  char: string;
  tahan: Data;
};
