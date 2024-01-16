import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import fetcher from "../functions/fetcher";
import tahan from "../types/tahan";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import setting from "../types/settings";
import Notify from "../functions/Notify";

type dashboard = {
  setLoading: (args: boolean) => void;
};

const Dashboard = ({ setLoading }: dashboard) => {
  const [tahanData, setTahanData] = useState<tahan[]>([]);
  const [settingsData, setSettings] = useState<setting[]>([]);
  const [hover, setHover] = useState<boolean>(false);

  const checker = () => {
    const returnVal = (index: number) => {
      return settingsData[index]["value"];
    };

    tahanData.map((field) => {
      if (field.name.includes("Temp")) {
        if (field.value > returnVal(0)) {
          Notify("Too hot! Turning Ac on");
          return;
        }
        if (field.value < returnVal(1)) {
          Notify("Too cold! Turning heater on");
          return;
        } else {
          console.log("Perfect!");
          return;
        }
      }

      if (field.name.includes("Humidity")) {
        if (field.value > returnVal(2)) {
          Notify("Too humid!, stopping sprinklers!");
          return;
        }
        if (field.value < returnVal(3)) {
          Notify("Too dry!, starting sprinklers!");
          return;
        } else {
          console.log("Perfect!");
          return;
        }
      }

      if (field.name.includes("Light")) {
        if (field.value > returnVal(4)) {
          Notify("Too bright! Closing shutters");
          return;
        }
        if (field.value < returnVal(5)) {
          Notify("Too dim! Opening shutters");
          return;
        } else {
          console.log("Perfect!");
          return;
        }
      }
    });
  };

  useEffect(() => {
    fetcher({ setTahanData, setLoading, setSettings });
    checker();

    const fetcherInterval = setInterval(() => {
      fetcher({ setTahanData, setLoading, setSettings });
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
