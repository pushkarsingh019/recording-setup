import { useContext, useState } from "react";
import { storeContext } from "./store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [fishNumber, setFishNumber] = useState();
  const [ballSize, setBallSize] = useState("35mm"); // Default value
  const { setFish, setBall } = useContext(storeContext);
  const navigate = useNavigate();

  const clickHandler = async () => {
    await setFish(fishNumber);
    await setBall(ballSize)
    navigate("/start");
  };

  return (
    <main className="m-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Which Fish are we training today?
        </label>
        <input
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="fishNumber"
          placeholder="Fish Number"
          type="number"
          onChange={(event) => setFishNumber(event.target.value)}
        />
      </div>
      <br />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Ball Size:
        </label>
        <select
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={ballSize}
          onChange={(event) => setBallSize(event.target.value)}
        >
          <option value="35mm">35mm</option>
          <option value="25mm">25mm</option>
        </select>
      </div>
      <br />
      <button
        onClick={clickHandler}
        className="ring-offset-background focus-visible:ring-ring hover:bg-primary/90 inline-flex h-10 translate-y-[1px] scale-95 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        Train Fish
      </button>
    </main>
  );
};

export default Home;