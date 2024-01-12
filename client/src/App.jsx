import axios from "axios";
import { useState } from "react";

function App() {
    const backendUrl = "http://localhost:8000";
    const [trialSate, setTrialState] = useState(false);
    return (
        <div className="mx-3 my-3">
            <h1 className="text-3xl">recording setup</h1>
            <br />
            <button
                disabled={trialSate ? true : false}
                onClick={() => {
                    axios.get(`${backendUrl}/start`);
                    setTrialState(!trialSate);
                }}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                start trial
            </button>
            <button
                disabled={trialSate === false ? true : false}
                onClick={() => {
                    setTrialState(!trialSate);
                    axios.get(`${backendUrl}/end`);
                }}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
                end trial
            </button>
            <button
                onClick={() => axios.get(`${backendUrl}/data`)}
                type="button"
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
                Get Data
            </button>
            <button
                onClick={() => axios.get(`${backendUrl}/stop`)}
                type="button"
                class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
                Stop Recording
            </button>
        </div>
    );
}

export default App;
