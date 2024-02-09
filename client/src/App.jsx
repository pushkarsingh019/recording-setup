import {BrowserRouter, Routes, Route } from "react-router-dom";

import Start from "./Start";
import Reaction from "./Reaction";
import Home from "./Home";

const App = () => {
    return(
        <main>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/start" element={<Start />} />
                    <Route path="/reaction" element={<Reaction />}/>
                </Routes>
            </BrowserRouter>
        </main>
    )
};

export default App;