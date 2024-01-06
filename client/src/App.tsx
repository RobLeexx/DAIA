import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SketchPage } from "./pages/SketchPage";
import { SketchFormPage } from "./pages/SketchFormPage";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/sketches" element={<SketchPage />}></Route>
        <Route path="/sketches-create" element={<SketchFormPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
