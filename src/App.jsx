
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AppSidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <header className="flex px-4  py-1 h-20 items-center text-center">
        <Link to={"/"} className="flex items-center justify-center ">
          <img height={80} width={80}  src="https://vedas.sac.gov.in/static/img/vedas_logo1.png" />
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<AppSidebar children={<Home />} />} />
      </Routes>
    </>
  );
}

export default App;
