import { createContext, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export const storeContext = createContext();

export const ContextProvider = ({ children }) => {
  const backendUrl = "http://localhost:8000";
  const [trialData, setTrialData] = useState();
  const [isTrialRunning, setIsTrialRunning] = useState(false);
  const [count, setCount] = useState(0);

  const store = {
    trialCount: count,
    trialData: trialData,
    isTrialRunning: isTrialRunning,
    trialDataExists: false,
    trialRunning: false,
    changeTrialState: (state) => setIsTrialRunning(state),
    setFish: async (fishNumber) => {
      try {
        await axios.get(`${backendUrl}/fishNumber/${fishNumber}`);
        setCount(0);
      } catch (error) {
        console.log(error.message);
      }
    },
    setDistance : async (stimuliDistance) => {
      try{
        await axios.get(`${backendUrl}/distance/${stimuliDistance}`);
      } catch (error) {
        console.log(error.message)
      }
    },
    getTrialInfo: async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/trialData`);
        setTrialData(data);
        store.trialDataExists = true;
      } catch (error) {
        toast.error("could not get trial information");
      }
    },
    startTrial: async () => {
      store.trialDataExists
        ? console.log("trial info there")
        : console.log("trial info is not here");
      if (store.trialDataExists) {
        try {
          console.log("starting trial...");
          await axios.get(`${backendUrl}/start`);
          toast.success("trial started");
          setIsTrialRunning(true);
          store.trialRunning = true;
          setCount(count + 1);
        } catch (error) {
          toast.error(`trial dint start ${error.message}`);
        }
      } else {
        toast.error("get trial info first");
      }
    },
    endTrial: async () => {
      console.log("is trial running ", store.trialRunning);
      if (store.trialRunning) {
        try {
          await axios.get(`${backendUrl}/end`);
          toast.success("trial ended");
          setIsTrialRunning(false);
          store.trialRunning = false;
          setTrialData();
          store.trialDataExists = false;
          return true;
        } catch (error) {
          toast.error(`trial did not end : ${error.message}`);
          return false;
        }
      } else {
        toast.error("did not end trial - trial is not running");
        return false;
      }
    },
    discardTrial: async () => {
      console.log("trial to be discarded");
      try {
        await axios.get(`${backendUrl}/discard`);
        toast.success("trial discarded");
        setTrialData();
        setIsTrialRunning(false);
      } catch (error) {
        toast.error(`could not discard trial : ${error.message}`);
      }
    },
    detection: async (detect) => {
      await axios.get(`${backendUrl}/detection/${detect}`);
      setTrialData();
    },
  };

  return (
    <storeContext.Provider value={store}>
      <Toaster />
      {children}
    </storeContext.Provider>
  );
};
