import {BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./Start";
import Reaction from "./Reaction";

const App = () => {
    return(
        <main>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/reaction" element={<Reaction />}/>
                </Routes>
            </BrowserRouter>
        </main>
    )
};

export default App;