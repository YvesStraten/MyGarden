type props = {
  setting: string;
};

const SettingContainer = ({ setting }: props) => {
  return (
    <div className="border">
      <h2 className="text-center">{setting}</h2>
    </div>
  );
};

export default SettingContainer;
