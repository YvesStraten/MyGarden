import Cog from "./Cog";

export default function MainHeader() {
  return (
    <div className="border flex place-content-center flex-row p-3 rounded-full w-1/6 my-5 gap-5">
      <h1 className="font-bold">Plot data</h1>
      <Cog />
    </div>
  );
}
