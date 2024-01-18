import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import Fetcher from "./functions/fetcher";
import Checker from "./functions/Checker";
import { setting, tahan } from "./types/types";

function App() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [tahanData, setTahanData] = useState<tahan[]>([]);
	const [settingsData, setSettings] = useState<setting[]>([]);

	/* 	Fetches and checks values with settings every refresh or interval */
	useEffect(() => {
		let arr: (tahan[] | setting[])[];
		Fetcher()
			.then((data) => {
				const [tahan, settings] = data;
				setTahanData(tahan);
				setSettings(settings);
				setLoading(false);

				return [tahan, settings];
			})
			.then((fields) => {
				const [tahan, settings] = fields;
				console.log(tahan);

				Checker(tahan, settings);
				arr = [tahan, settings];
			});

		const fetcherInterval = setInterval(() => {
			Fetcher().then((data) => {
				const [tahan, settings] = data;
				setTahanData(tahan);
				setSettings(settings);

				arr = [tahan, settings];
			});
		}, 20000);

		const notifInterval = setInterval(() => {
			Checker(arr[0], arr[1]);
		}, 40000);

		return () => {
			clearInterval(fetcherInterval);
			clearInterval(notifInterval);
		};
	}, []);

	return (
		<>
			{isLoading === false ? (
				<Dashboard tahanData={tahanData} settingsData={settingsData} />
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
}

export default App;
