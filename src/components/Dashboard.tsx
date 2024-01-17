import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Fetcher from "../functions/fetcher";
import tahan from "../types/tahan";
import setting from "../types/settings";
import Notify from "../functions/Notify";
import Display from "./Display";
import "./Dashboard.css";

type dashboard = {
	setLoading: (args: boolean) => void;
};

const Dashboard = ({ setLoading }: dashboard) => {
	/* 	Stores states for the cog, data and settings */
	const [tahanData, setTahanData] = useState<tahan[]>([]);
	const [settingsData, setSettings] = useState<setting[]>([]);
	const [hover, setHover] = useState<boolean>(false);

	const checker = () => {
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

	/* 	Fetches and checks values with settings every refresh or interval */
	useEffect(() => {
		Fetcher({ setTahanData, setLoading, setSettings });
		checker();

		const fetcherInterval = setInterval(() => {
			Fetcher({ setTahanData, setLoading, setSettings });
		}, 20000);

		const checkerInterval = setInterval(() => {
			checker();
		}, 60000);

		return () => {
			clearInterval(fetcherInterval);
			clearInterval(checkerInterval);
		};
	}, []);

	return (
		<>
			<div className="header">
				<h1>Data Tahan-Tahan</h1>
				<Link
					to="/settings"
					id="cog"
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<FontAwesomeIcon icon={faCog} className={hover ? "spin" : ""} />
				</Link>
			</div>
			<div className="settings_container">
				<h1>Current settings: </h1>
				<div className="settings">
					{settingsData.map((setting) => {
						// Maps over the settings
						const name = setting.setting;
						if (name.includes("humidity")) {
							return (
								<h2>
									{setting.setting}: {setting.value} %
								</h2>
							);
						} else if (name.includes("lux")) {
							return (
								<h2>
									{setting.setting}: {setting.value} lx
								</h2>
							);
						} else {
							return (
								<h2>
									{setting.setting}: {setting.value} °C
								</h2>
							);
						}
					})}
				</div>
			</div>
			<div className="main_container">
				{tahanData.map((tahan) => {
					if (tahan.name.includes("Humidity")) {
						return <Display char="%" tahan={tahan} />;
					} else if (tahan.name.includes("Light")) {
						return <Display char="lx" tahan={tahan} />;
					} else {
						return <Display char="°C" tahan={tahan} />;
					}
				})}
			</div>
		</>
	);
};

export default Dashboard;
