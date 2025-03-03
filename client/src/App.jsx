import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import ChatPage from "./Pages/ChatPage";
import "./Styles/App.css";
import ChatArea from "./Components/ChatArea";
import Users from "./Components/Users";
import Groups from "./Components/Groups";
import CreateGroup from "./Components/CreateGroup";
import { useSelector } from "react-redux";
import MobileChats from "./Components/MobileChats";

function App() {
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <>
      <div className={"App" + (lightTheme ? "" : " dark-container")}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="app" element={<ChatPage />}>
            <Route path="chat" element={<MobileChats />}></Route>
            <Route path="chat/:id" element={<ChatArea />}></Route>
            <Route path="users" element={<Users />}></Route>
            <Route path="groups" element={<Groups />}></Route>
            <Route path="create-groups" element={<CreateGroup />}></Route>
          </Route>
        </Routes>
        <div className="background-div"></div>
      </div>
    </>
  );
}

export default App;
