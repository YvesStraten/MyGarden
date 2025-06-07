import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Display from "./Display";
// import "./Dashboard.css";
import { dashboard } from "../types/types";
import { Data, Setting } from "../bindings";

const Dashboard = ({ tahanData, settingsData }: dashboard) => {
  /* 	Stores states for the cog, data and settings */
  const [hover, setHover] = useState<boolean>(false);

  return (
    <>
      <div className="header border flex place-content-center flex-row p-3 m-auto rounded-full w-1/2 my-5 gap-5">
        <h1 className="font-bold">Data Tahan-Tahan</h1>
        <Link
          to="/settings"
          id="cog"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <FontAwesomeIcon icon={faCog} className={hover ? "spin" : ""} />
        </Link>
      </div>
      <div className="settings_container border flex items-center flex-col rounded-full m-auto p-1 w-1/3">
        <h1 className="font-bold">Current settings:</h1>
        <div className="settings flex flex-col items-center">
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
      <div className="main_container flex flex-wrap items-center m-auto gap-5">
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
