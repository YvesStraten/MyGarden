import { Data, Setting } from "../bindings";

export type dashboard = {
  tahanData: Data[];
  settingsData: Setting[];
};

export type settingsForm = {
  maxtemp: string;
  maxhumid: string;
  maxlight: string;

  mintemp: string;
  minhumid: string;
  minlight: string;
};
