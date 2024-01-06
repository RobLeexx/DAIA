import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Registros } from "./pages/Registros";
import { Inicio } from "./pages/Inicio";
import { Navigation } from "./components/Navigation";
import { OpenFace } from "./pages/OpenFace";
import { Sketch } from "./pages/Sketch";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio"/>}></Route>
        <Route path="/inicio" element={<Inicio />}></Route>
        <Route path="/registros" element={<Registros />}></Route>
        <Route path="/sketch" element={<Sketch />}></Route>
        <Route path="/busqueda" element={<OpenFace />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
