import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Display from "./Display";
import "./Dashboard.css";
import { dashboard } from "../types/types";
import { Data, Setting } from "../bindings";

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
          {settingsData.map((setting: Setting) => {
            // Maps over the settings
            const name = setting.name;
            if (name.includes("humidity")) {
              return (
                <h2 key={setting.name}>
                  {setting.name}: {setting.value} %
                </h2>
              );
            } else if (name.includes("lux")) {
              return (
                <h2 key={setting.name}>
                  {setting.name}: {setting.value} lx
                </h2>
              );
            } else {
              return (
                <h2 key={setting.name}>
                  {setting.name}: {setting.value} °C
                </h2>
              );
            }
          })}
        </div>
      </div>
      <div className="main_container">
        {tahanData.map((tahan: Data) => {
          if (tahan.name.includes("Humidity")) {
            console.log(tahan);
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
