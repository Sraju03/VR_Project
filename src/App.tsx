// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./features/Home";
import Processing from "./features/processing/Processing";
import Viewer from "./features/viewer/Viewer";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/viewer" element={<Viewer />} />
    </Routes>
  </BrowserRouter>
);

export default App;