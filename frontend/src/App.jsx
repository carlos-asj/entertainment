import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css";
import Home from "./components/Home";
import SeriesList from "./components/SeriesList"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/series" element={<SeriesList />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
