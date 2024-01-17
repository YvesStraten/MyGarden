import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Fetcher from "../functions/fetcher";
import Display from "./Display";
import Checker from "../functions/Checker";
import tahan from "../types/tahan";
import setting from "../types/settings";
import "./Dashboard.css";

type dashboard = {
	setLoading: (args: boolean) => void;
};

const Dashboard = ({ setLoading }: dashboard) => {
	/* 	Stores states for the cog, data and settings */
	const [tahanData, setTahanData] = useState<tahan[]>([]);
	const [settingsData, setSettings] = useState<setting[]>([]);
	const [hover, setHover] = useState<boolean>(false);

	/* 	Fetches and checks values with settings every refresh or interval */
	useEffect(() => {
		Fetcher({ setTahanData, setLoading, setSettings });

		const fetcherInterval = setInterval(() => {
			Fetcher({ setTahanData, setLoading, setSettings });
		}, 20000);

		const checkerInterval = setInterval(() => {
			Checker({ tahanData, settingsData });
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
