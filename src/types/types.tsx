export type dashboard = {
	tahanData: tahan[];
	settingsData: setting[];
};

/* Defines a type for the objects
in the array */
export type tahan = {
	id: string;
	name: string;
	value: number;
	graph: string;
};

export type setting = {
	setting: string;
	value: number;
};

export type checker = {
	tahanData: tahan[];
	settingsData: setting[];
};

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
	tahan: tahan;
};
