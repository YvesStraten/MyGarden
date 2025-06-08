import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Display from "./Display";
import { dashboard } from "../types/types";
import { Data, Setting } from "../bindings";
import SettingContainer from "./SettingContainer";

const Dashboard = ({ tahanData, settingsData }: dashboard) => {
  /* 	Stores states for the cog, data and settings */
  const [hover, setHover] = useState<boolean>(false);

  return (
    <>
      <div className="border flex place-content-center flex-row p-3 m-auto rounded-full w-1/6 my-5 gap-5">
        <h1 className="font-bold">Data Tahan-Tahan</h1>
        <Link
          to="/settings"
          id="cog"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <FontAwesomeIcon
            icon={faCog}
            className={hover ? "animate-spin" : ""}
          />
        </Link>
      </div>
      <div className="flex flex-col m-auto p-1 w-1/6 gap-3">
        <h1 className="font-bold text-center">Current settings:</h1>
        <div className="grid grid-rows-2 grid-cols-2 gap-3">
          {settingsData.map((setting: Setting) => {
            // Maps over the settings
            const name = setting.name;
            const base = name + ": " + setting.value;
            if (name.includes("humidity")) {
              return <SettingContainer setting={base + "%"} />;
            } else if (name.includes("lux")) {
              return <SettingContainer setting={base + "lx"} />;
            } else {
              return <SettingContainer setting={base + "°C"} />;
            }
          })}
        </div>
      </div>
      <div className="m-auto gap-3 w-1/2 grid grid-rows-2 grid-cols-2">
        {tahanData.map((tahan: Data) => {
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
