export type dashboard = {
  tahanData: Tahan[];
  settingsData: Setting[];
};

/* Defines a type for the objects
in the array */
export type Tahan = {
  id: string;
  name: string;
  value: number;
  graph: string;
};

export type Setting = {
  setting: string;
  value: number;
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
  tahan: Tahan;
};
