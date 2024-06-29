import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import checker from "./functions/checker";
import { Setting, Tahan } from "./types/types";
import { invoke } from "@tauri-apps/api";

function App() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [tahanData, setTahanData] = useState<Tahan[]>([]);
    const [settingsData, setSettings] = useState<Setting[]>([]);

    /* 	Fetches and checks values with settings every refresh or interval */
    useEffect(() => {
        let arr: any = [];
        async function load() {
            const plots: Array<Tahan> = await invoke("fetchplots");
            const settings: Array<Setting> = await invoke("getsettings");

            setTahanData(plots);
            setSettings(settings);

            setLoading(false);
            checker(plots, settings);

            arr = [plots, settings]
        };

        load();


        const fetcherInterval = setInterval(async () => {
            const plots: Array<Tahan> = await invoke("fetchplots");
            const settings: Array<Setting> = await invoke("getsettings");
            setTahanData(plots);
            setSettings(settings);

            arr = [plots, settings];
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
