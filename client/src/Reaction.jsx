import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeContext } from "./store";

const Reaction = () => {
  const navigate = useNavigate();
  const { detection } = useContext(storeContext);

  const detectionHandler = async (detect) => {
    await detection(detect);
    navigate("/start");
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "y") {
        detectionHandler(1);
      } else if (e.key === "n") {
        detectionHandler(0);
      } else if (e.key === "m") {
        detectionHandler(2);
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <main className="mx-3 my-3">
      <h2 className="text-xl">Did the fish respond ?</h2>
      <br />
      <button
        className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={() => detectionHandler(1)}
      >
        Yes (y)
      </button>
      <button
        className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={() => detectionHandler(0)}
      >
        No (n)
      </button>
      <button
        className="mb-2 me-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        onClick={() => detectionHandler(2)}
      >
        did not respond (m)
      </button>
    </main>
  );
};

export default Reaction;
