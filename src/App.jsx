
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppSidebar from "./components/Sidebar";
import ExtractedImage from "./components/ExtractedImage";

function App() {
  return (
    <>
      <header className="flex px-4 bg-gray-800  py-1 h-20 items-center text-center">
        <Link to={"/"} className="flex items-center justify-center ">
          <img height={80} width={80}  src="https://vedas.sac.gov.in/static/img/vedas_logo1.png" />
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<AppSidebar children={<Home />} />} />
        <Route path="/extracted-image" element={<ExtractedImage/>} />
      </Routes>
    </>
  );
}

export default App;
