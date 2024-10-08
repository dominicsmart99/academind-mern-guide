import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import PlacesList from "./places/pages/PlacesList";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/user/places" exact>
          <PlacesList />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
