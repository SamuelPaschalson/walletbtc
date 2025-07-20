import React from "react";
import Home from "./pages/home/Home";
import "./app.scss";
import Login from "./pages/login/Login";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Start from "./pages/start/Start";
import { useState } from "react";
import Profile from "./pages/profile/Profile";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || false);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Redirect to="login" />}
        </Route>
        <Route exact path="/login">
          {!user ? <Login setUser={setUser} /> : <Redirect to="login" />}
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/start">
          <Start />
        </Route>
        <Route path="/browse">
          <Profile />
        </Route>
        {user && (
          <>
            <Route exact path="/series">
              <Home type="series" />
            </Route>
            <Route exact path="/movies">
              <Home type="movie" />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default App;
