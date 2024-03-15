import { useContext, useState } from "react";
import { storeContext } from "./store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [fishNumber, setFishNumber] = useState();
  const [d, setD] = useState(); // using weird variable name since setDistance is already taken.
  const { setFish, setDistance } = useContext(storeContext);
  const navigate = useNavigate();

  const clickHandler = async () => {
    await setFish(fishNumber);
    await setDistance(d);
    navigate("/start");
  };

  return (
    <main className="m-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Which Fish are we training today ?
        </label>
        <input
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          id="text"
          placeholder="Fish Number"
          type="Number"
          onChange={(event) => setFishNumber(event.target.value)}
        />
        <input className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
          id="number"
          placeholder="Distance"
          type="Number"
          onChange={event => setD(event.target.value)}
        />
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
