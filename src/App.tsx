// // import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./features/home";
// import Viewer from "./features/viewer/viewer";
// import SceneViewer from "./features/scene-viewer/SceneViewer";
// import Processing from "./features/processing/processing";
// import Preview from "./features/preview/preview";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/viewer" element={<Viewer />} />
//         <Route path="/viewer/SceneViewer" element={<SceneViewer />} />
//         <Route path="/processing" element={<Processing />} />
//         <Route path="/previewer" element={<Preview />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/features/Home"; // Import the Home component
import Processing from "../src/features/processing/Processing"; // Import the Processing component
import Viewer from "./features/viewer/Viewer";
import SceneViewer from "./features/scene-viewer/SceneViewer";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/viewer" element={<Viewer />} />
      <Route path="/scene-viewer" element={<SceneViewer />} />
    </Routes>
  </BrowserRouter>
);

export default App;
