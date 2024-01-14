import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import fetcher from "../functions/fetcher";
import tahan from "../types/tahan";
import { faCog } from "@fortawesome/free-solid-svg-icons";

type dashboard = {
	setLoading: (args: boolean) => void;
};
const Dashboard = ({ setLoading }: dashboard) => {
	const [tahanData, setTahanData] = useState<tahan[]>([]);
	const [hover, setHover] = useState<boolean>(false);

	useEffect(() => {
		fetcher({ tahanData, setTahanData });

		const intervalId = setInterval(
			() => fetcher({ tahanData, setTahanData, setLoading }),
			20000,
		);
		return () => clearInterval(intervalId);
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
			<div className="main_container">
				{tahanData.map((tahan) => {
					if (tahan.name.includes("Humidity")) {
						return (
							<div key={tahan.id} className="tahan_container">
								<h1>{tahan.name}</h1>
								<h1>{tahan.value} %</h1>
								<h2>Past values:</h2>
								<iframe src={tahan.graph} className="iframe"></iframe>
							</div>
						);
					} else if (tahan.name.includes("Light")) {
						return (
							<div key={tahan.id} className="tahan_container">
								<h1>{tahan.name}</h1>
								<h1>{tahan.value} lx</h1>
								<h2>Past values:</h2>
								<iframe src={tahan.graph} className="iframe"></iframe>
							</div>
						);
					} else {
						return (
							<div key={tahan.id} className="tahan_container">
								<h1>{tahan.name}</h1>
								<h1>{tahan.value} °C</h1>
								<h2>Past values:</h2>
								<iframe src={tahan.graph} className="iframe"></iframe>
							</div>
						);
					}
				})}
			</div>
		</>
	);
};

export default Dashboard;
