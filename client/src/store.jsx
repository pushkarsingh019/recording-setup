import {createContext, useState} from "react"
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export const storeContext = createContext();

export const ContextProvider = ({children}) => {
    const backendUrl = "http://localhost:8000";
    const [trialData, setTrialData] = useState();

    const store = {
        trialData : trialData,
        getTrialInfo : async () => {
            try {
                const {data} = await axios.get(`${backendUrl}/trialData`);
                setTrialData(data);
            } catch (error) {
                toast.error("could not get trial information")
            }
        },
        startTrial : async () => {
            console.log("starting trial...");
            try {
                await axios.get(`${backendUrl}/start`);
                toast.success("trial started");
            } catch (error) {
                toast.error("trial dint start : error");
            }
        },
        endTrial : async () => {
            console.log("ending trial...");
            try {
                await axios.get(`${backendUrl}/end`);
                toast.success("trial ended");
        } catch (error) {
                toast.error("trial did not end : error");
            }
            setTrialData();
        },
        discardTrial : async () => {
            console.log('trial to be discarded');
            try {
                await axios.get(`${backendUrl}/discard`)
                toast.success("trial discarded")
            } catch (error) {
                toast.error("could not dicard trial")
            }
        },
        detection : async (detect) => {
            await axios.get(`${backendUrl}/detection/${detect}`);
            setTrialData();
        }
    }

    return(
        <storeContext.Provider value={store}>
            <Toaster />
            {children}
        </storeContext.Provider>
    )
};