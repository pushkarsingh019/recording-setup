import {useContext, useState} from "react"
import { storeContext } from "./store";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [fishNumber, setFishNumber] = useState();
    const { setFish } = useContext(storeContext);
    const navigate = useNavigate();

    const clickHandler = async () => {
        await setFish(fishNumber);
        navigate('/start');
    }

    return(
        <main className="m-5">
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    for="Number"
                >
                    Which Fish are we training today ?
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="text"
                    placeholder="Fish Number"
                    type="Number"
                    onChange={event => setFishNumber(event.target.value)}
                />
            </div>
            <br />
            <button onClick={clickHandler} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-gray-900 text-white shadow-md translate-y-[1px] scale-95 hover:scale-100 transition-colors rounded-md">Train Fish</button>
        </main>
    );

}

export default Home;