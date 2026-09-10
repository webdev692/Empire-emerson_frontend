import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormModalProvider } from "./components/EPDG/FormModal";
import ScrollManager from "./components/EPDG/ScrollManager";
import LandingPage from "./components/EPDG/LandingPage";
import ClassesPage from "./components/EPDG/ClassesPage";
import FeedbackView from "./components/EPDG/FeedbackView";

function App() {
  const base = import.meta.env.BASE_URL

  return (
    <BrowserRouter basename={base}>
      <FormModalProvider>
        <ScrollManager />
        <div className="font-sans">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/assignments/:assignmentId/feedback" element={<FeedbackView />} />
          </Routes>
        </div>
      </FormModalProvider>
    </BrowserRouter>
  );
}

export default App;
