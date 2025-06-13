import Display from "./Display";
import { dashboard } from "../types/types";
import { Data, Setting } from "../bindings";
import SettingContainer from "./SettingContainer";
import MainHeader from "./MainHeader";

export default function Dashboard({ tahanData, settingsData }: dashboard) {
  return (
    <div className="flex flex-col items-center  gap-3">
      <MainHeader />
      <div className="flex flex-col m-auto p-1 w-2/4 gap-3">
        <h1 className="font-bold text-center">Current settings:</h1>
        <div className="grid grid-rows-2 grid-cols-2 gap-3">
          {settingsData.map((setting: Setting) => (
            <SettingContainer key={setting.name} {...setting} />
          ))}
        </div>
      </div>
      <div className="w-3/4 m-auto gap-3 grid lg:grid-cols-2 md:grid-cols-1">
        {tahanData.map((tahan: Data) => (
          <Display key={tahan.id} {...tahan} />
        ))}
      </div>
    </div>
  );
}
