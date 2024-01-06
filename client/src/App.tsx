import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SketchPage } from "./pages/SketchPage";
import { SketchFormPage } from "./pages/SketchFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sketches" element={<SketchPage />}></Route>
        <Route path="/sketches" element={<SketchFormPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
