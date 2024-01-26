import axios from "axios";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";


function App() {
    const backendUrl = "http://localhost:8000";
    const [trialSate, setTrialState] = useState(false);
    const [trialStage, setTrialStage] = useState(0);
    let timeout;

    const stimulusData = async (stimulus) => {
        // 0 -> negative
        // 1 -> positive
        await axios.get(`${backendUrl}/stimulus/${stimulus}`);
    };
    const side = async (side) => {
        // 0 -> left
        // 1 -> right
        try {
            await axios.get(`${backendUrl}/side/${side}`)
        } catch (error) {
            console.log(error.message)
        }
        setTrialStage(1)
    }
    const startTrial = async () => {
        console.log("trial started...");
        try {
            await axios.get(`${backendUrl}/start`);
            setTrialState(!trialSate);
            toast.success("trial started");

            // trial time
            timeout = setTimeout(endTrial, 60000)
        } catch (error) {
            toast.error("trial dint start : error");
        }
    };
    const endTrial = async () => {
        console.log("trial ended");
        try {
            await axios.get(`${backendUrl}/end`);
            toast.success("trial ended");
            setTrialState(!trialSate);
    } catch (error) {
            toast.error("trial did not end : error");
        }
        setTrialStage(2)
        clearTimeout(timeout);
    };
    const discardTrial = async () => {
        console.log('trial to be discarded');
        try {
            await axios.get(`${backendUrl}/discard`)
            toast.success("trial discarded")
        } catch (error) {
            toast.error("could not dicard trial")
        }
        setTrialStage(0)
    };

    const detect = async (detect) => {
        await axios.get(`${backendUrl}/detection/${detect}`);
        setTrialStage(0)
    }

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === "s") {
                startTrial();
            }else if (e.key === "e") {
                endTrial();
            } else if (e.key === "x"){
                discardTrial();
            } else if (e.key === "a") {
                stimulusData(1)
            } else if (e.key === "d") {
                stimulusData(0)
            } else if (e.key === "q") {
                side(0);
            } else if (e.key === "w") {
                side(1)
            } else if (e.key === "y") {
                detect(1)
            } else if (e.key === "n") {
                detect(0)
            }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    switch (trialStage) {
        case 1:
            return(
            <div className="mx-3 my-3">
            <Toaster />
            <h1 className="text-3xl">Recording Setup</h1>
            <br />
            <div>
            <button
                disabled={trialSate ? true : false}
                onClick={startTrial}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                start trial
            </button>
            <button
                disabled={trialSate === false ? true : false}
                onClick={endTrial}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
                end trial
            </button>
            </div>
        </div>)
            break;
        case 0:
            return(
            <div>
                <h4 className="text-3xl">Trial Information</h4>
                <br />
                <button onClick={() => stimulusData(1)} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Positive Stimulus (A)</button>
                <button onClick={() => stimulusData(0)} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Negative Stimulus (D)</button>
                <button onClick={() => side(0)} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Left Side(Q)</button>
                <button onClick={() => side(1)} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Rigt Side (W)</button>
                <button
                onClick={() => axios.get(`${backendUrl}/data`)}
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
                Get Data
            </button>
            </div>)
            break;
        case 2:
            return(
                <div>
                    <h2 className="text-3xl">How did the fish respond ?</h2>
                    <br />
                    <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => detect(1)}>correct detection (y)</button>
                    <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => detect(0)}>wrong detection (n)</button>
                </div>
            )
            
        default:
            break;
    }
}

export default App;
