import { useContext } from "react";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { storeContext } from "./store";
import { useNavigate } from "react-router-dom";

const Start = () => {

    const {changeTrialState, trialData, getTrialInfo, startTrial, endTrial, discardTrial, isTrialRunning} = useContext(storeContext);
    const navigate = useNavigate();

    // variable to automatically stop trial after delay.
    let timeout;
    const delay = 60000 // 60 seconds.

    const startHandler = () => {
        startTrial();
        changeTrialState(true);
        timeout = setTimeout(endHandler, delay);
    };

    const endHandler = () => {
        endTrial();
        changeTrialState(false);
        clearTimeout(timeout);
        navigate(`/reaction`);
    };

    const discardHandler = () => {
        clearTimeout(timeout);
        discardTrial();
        changeTrialState(False);
    };

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === "s") {
                startHandler();
            }else if (e.key === "e") {
                endHandler();
            } else if (e.key === "x"){
                discardHandler();
            } else if (e.key === "t"){
                console.log("Getting Trial Info");
                getTrialInfo();
            } 
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);


    return(
        <main className="mx-3 my-3">
            <h1 className="text-3xl">Start your Trial...</h1>
            <br />
            <p>{trialData === undefined ? <span><i>press <strong>t</strong> to get trial information</i> or <span onClick={() => getTrialInfo()} className="text-blue-600 underline cursor-pointer">click here</span> </span>: <span><strong>{trialData.stimulus}</strong> stimulus, <strong>{trialData.side}</strong> side</span>}</p>
            {/* <p>
                {stimulus !== undefined ? <span><strong>{stimulus}</strong> stimulus, <strong>{side}</strong> side</span> : <i>press <strong>t</strong> to get trial information.</i>}
            </p> */}
            <br />
            {isTrialRunning === false ? <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"  onClick={startHandler}>Start Trial (S)</button> : <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"  onClick={endHandler}>End Trial (E)</button>}
            <br />
            <br />
            <span onClick={() => navigate('/')} className="mx-1 text-blue-600 text-sm underline cursor-pointer">change fish number</span>
        </main>
    )
};

export default Start