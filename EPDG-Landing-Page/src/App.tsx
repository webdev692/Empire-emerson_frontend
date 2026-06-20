import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormModalProvider } from "./components/EPDG/FormModal";
import ScrollManager from "./components/EPDG/ScrollManager";
import LandingPage from "./components/EPDG/LandingPage";
import ClassesPage from "./components/EPDG/ClassesPage";

function App() {
  return (
    <BrowserRouter>
      <FormModalProvider>
        <ScrollManager />
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/classes" element={<ClassesPage />} />
          </Routes>
        </div>
      </FormModalProvider>
    </BrowserRouter>
  );
}

export default App;
