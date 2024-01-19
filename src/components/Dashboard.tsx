import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Display from "./Display";
import "./Dashboard.css";
import { dashboard } from "../types/types";

const Dashboard = ({ tahanData, settingsData }: dashboard) => {
  /* 	Stores states for the cog, data and settings */
  const [hover, setHover] = useState<boolean>(false);

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
                <h2 key={setting.setting}>
                  {setting.setting}: {setting.value} %
                </h2>
              );
            } else if (name.includes("lux")) {
              return (
                <h2 key={setting.setting}>
                  {setting.setting}: {setting.value} lx
                </h2>
              );
            } else {
              return (
                <h2 key={setting.setting}>
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
            return <Display key={tahan.id} char="%" tahan={tahan} />;
          } else if (tahan.name.includes("Light")) {
            return <Display key={tahan.id} char="lx" tahan={tahan} />;
          } else {
            return <Display key={tahan.id} char="°C" tahan={tahan} />;
          }
        })}
      </div>
    </>
  );
};

export default Dashboard;
