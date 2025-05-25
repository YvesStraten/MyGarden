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
  maxtemp: number | string;
  maxhumid: number | string;
  maxlight: number | string;

  mintemp: number | string;
  minhumid: number | string;
  minlight: number | string;
};

export type display = {
  char: string;
  tahan: Data;
};
