import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useCallback, Fragment } from "react";
import Users from "./user/pages/Users";
import Authenticate from "./user/pages/Authenticate";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;
  routes = isLoggedIn ? (
    <Fragment>
      <Route path="/" Component={Users} />
      <Route path="/places/new" Component={NewPlace} />
      <Route path="/:userId/places" Component={UserPlaces} />
      <Route path="/:userId/places/:placeId" Component={UpdatePlace} />
      <Route path="*" element={<Navigate to="/" />} />
    </Fragment>
  ) : (
    <Fragment>
      <Route path="/" Component={Users} />
      <Route path="/auth" Component={Authenticate} />
      <Route path="/:userId/places" Component={UserPlaces} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Fragment>
  );

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Routes>{routes}</Routes>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
