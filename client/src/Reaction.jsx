import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storeContext } from "./store";

const Reaction = () => {
    const navigate = useNavigate();
    const {detection} = useContext(storeContext);

    const detectionHandler = async (detect) => {
        console.log("detection handler")
        await detection(detect);
        navigate('/');
    };

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === "y") {
                detectionHandler(1)
            } else if (e.key === "n") {
                detectionHandler(0)
            } else if (e.key === "m"){
                detectionHandler(2)
            }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    return(
        <main className="mx-3 my-3">
            <h2 className="text-xl">How did the fish respond ?</h2>
                    <br />
                    <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => detectionHandler(1)}>correct detection (y)</button>
                    <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => detectionHandler(0)}>wrong detection (n)</button>
                    <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={() => detectionHandler(2)}>no detection (m)</button>
        </main>
    )
};

export default Reaction