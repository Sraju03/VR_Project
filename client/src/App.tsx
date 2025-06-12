import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./features/Home";
import Processing from "./features/processing/Processing";
import Viewer from "./features/viewer/Viewer";
import ViewerShare from "./features/viewer-share/ViewerShare";
import Login from "./features/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
        />
        <Route path="/processing" element={<Processing />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/viewer-Share/:viewerId" element={<ViewerShare />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;