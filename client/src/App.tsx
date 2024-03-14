import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Criminales } from "./pages/Criminales";
import { Inicio } from "./pages/Inicio";
import { Navigation } from "./components/Navigation";
import { OpenFace } from "./pages/OpenFace";
import { Sketch } from "./pages/Sketch";
import { Casos } from "./pages/Casos";
import { CriminalCard } from "./components/Records/CriminalCard";
import { Identikits } from "./pages/Identikits";
import { SketchCard } from "./components/Records/SketchCard";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />}></Route>
        <Route path="/inicio" element={<Inicio />}></Route>
        <Route path="/criminales" element={<Criminales />}></Route>
        <Route path="/identikits" element={<Identikits />}></Route>
        <Route path="/casos" element={<Casos />}></Route>
        <Route path="/sketch" element={<Sketch />}></Route>
        <Route path="/busqueda" element={<OpenFace />}></Route>
        <Route path="/criminales/:id" element={<CriminalCard />}></Route>
        <Route path="/sketches/:id" element={<SketchCard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
