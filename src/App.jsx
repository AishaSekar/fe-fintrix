import { Routes, Route } from "react-router-dom";
import NavBarComponent from "./components/NavBarComponent";
import HomePage from "./pages/HomePage";
import GetStartedPage from "./pages/GetStartedPage";

function App() {
  return (
    <div className="App">
      <NavBarComponent />
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/getstarted" Component={GetStartedPage} />
      </Routes>
    </div>
  );
}

export default App;
