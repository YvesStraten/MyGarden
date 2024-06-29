import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import fetcher from "./functions/fetcher";
import checker from "./functions/checker";
import { Setting, Tahan } from "./types/types";
import { invoke } from "@tauri-apps/api";

function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [tahanData, setTahanData] = useState<Tahan[]>([]);
  const [settingsData, setSettings] = useState<Setting[]>([]);

  /* 	Fetches and checks values with settings every refresh or interval */
  useEffect(() => {
    let arr: any;
    fetcher()
      .then(async (data) => {
        const test: string  = await invoke("fetchplots");
          const lol = JSON.parse(test);
        console.log(lol);

        const [tahan, settings] = data;
        setTahanData(tahan);
        setSettings(settings);
        setLoading(false);

        return [tahan, settings];
      })
      .then((fields) => {
        console.log(fields);
        const [tahan, settings] = fields;
        console.log(tahan);

        checker(tahan, settings);

        arr = [tahan, settings];
      });

    const fetcherInterval = setInterval(() => {
      fetcher().then((data) => {
        const [tahan, settings] = data;
        setTahanData(tahan);
        setSettings(settings);

        arr = [tahan, settings];
      });
    }, 20000);

    const notifInterval = setInterval(() => {
      checker(arr[0], arr[1]);
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
