import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeContext } from "./store";

const Start = () => {
  const {
    trialData,
    getTrialInfo,
    startTrial,
    endTrial,
    discardTrial,
    isTrialRunning,
    trialCount,
    changeTrialState,
  } = useContext(storeContext);
  const navigate = useNavigate();

  // variable to automatically stop trial after delay.
  let timeout;
  const toSeconds = 1000;
  const targetDelay = 60; // enter the time in seconds.
  const delay = targetDelay * toSeconds;

  const startHandler = () => {
    startTrial();
    timeout = setTimeout(endHandler, delay);
  };

  const endHandler = async () => {
    let moveForward = await endTrial();
    moveForward ? clearTimeout(timeout) : "";
    moveForward ? navigate(`/reaction`) : "";
  };

  const discardHandler = () => {
    clearTimeout(timeout);
    discardTrial();
    changeTrialState(false);
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "s") {
        startHandler();
      } else if (e.key === "e") {
        endHandler();
      } else if (e.key === "x") {
        discardHandler();
      } else if (e.key === "t") {
        console.log("Getting Trial Info");
        getTrialInfo();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <main className="mx-3 my-3">
      <h1 className="font-mono text-sm">Start your Trial...</h1>
      <p className="font-serif text-4xl">
        {trialData === undefined ? (
          <span>
            <i>
              press <strong>t</strong> to get trial information
            </i>{" "}
            or{" "}
            <span
              onClick={() => getTrialInfo()}
              className="cursor-pointer text-blue-600 underline"
            >
              click here
            </span>{" "}
          </span>
        ) : (
          <span className="text-md">
            <strong>{trialData.distance}</strong> cm
            <br />
            <strong> Ball : {trialData.ball}</strong> 
          </span>
        )}
      </p>
      {/* <p>
                {stimulus !== undefined ? <span><strong>{stimulus}</strong> stimulus, <strong>{side}</strong> side</span> : <i>press <strong>t</strong> to get trial information.</i>}
            </p> */}
      <br />
      <div className="flex items-center gap-x-10">
        {isTrialRunning === false ? (
          <button
            className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            onClick={startHandler}
          >
            Start Trial (S)
          </button>
        ) : (
          <button
            className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            onClick={endHandler}
          >
            End Trial (E)
          </button>
        )}
        <div className="text-lg font-medium">
          <i>
            {isTrialRunning
              ? `running trial ${trialCount}`
              : `start trial ${trialCount + 1}`}
          </i>
        </div>
      </div>
      <br />
      <span
        onClick={() => navigate("/")}
        className="mx-1 cursor-pointer text-sm text-blue-600 underline"
      >
        change fish number
      </span>
    </main>
  );
};

export default Start;
