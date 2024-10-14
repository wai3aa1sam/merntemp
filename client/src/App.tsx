import "./App.css"

import { Route, Routes } from "react-router-dom"
import axios from "axios";

import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProjectSettings } from "./mnt_client_config"
import { UserCotextProvider } from "./context/UserContext";
import AccountPage from "./pages/AccountPage";

function App() {

    axios.defaults.baseURL          = ProjectSettings.instance.serverUrl;
    axios.defaults.withCredentials  = true;

    return (
        <UserCotextProvider>
            <Routes>
                <Route path = "/" element = { <Layout /> }>
                    <Route index                            element = {<IndexPage />} />
                    <Route path = "/login"                  element = {<LoginPage />} />
                    <Route path = "/register"               element = {<RegisterPage />} />
                    <Route path = "/account/:subpage?"      element = {<AccountPage />} />
                </Route>
            </Routes>
        </UserCotextProvider>
    );
}

export default App
