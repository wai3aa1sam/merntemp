import "./App.css"

import { Route, Routes } from "react-router-dom"
import axios from "axios";

import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProjectSettings } from "./mnt_client_config"
import { UserCotextProvider } from "./context/UserContext";
import ProfilePage from "./pages/ProfilePage";
import PlacesPage from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";

function App() {

    axios.defaults.baseURL          = ProjectSettings.instance.serverUrl;
    axios.defaults.withCredentials  = true;

    return (
        <UserCotextProvider>
            <Routes>
                <Route path = "/" element = { <Layout /> }>
                    <Route index                                   element = {<IndexPage />} />
                    <Route path = "/login"                         element = {<LoginPage />} />
                    <Route path = "/register"                      element = {<RegisterPage />} />
                    <Route path = "/account/:subpage?"             element = {<ProfilePage />} />
                    <Route path = "/account/places"                element = {<PlacesPage />} />
                    <Route path = "/account/places/new"            element = {<PlacesFormPage />} />
                </Route>
            </Routes>
        </UserCotextProvider>
    );
}

export default App
