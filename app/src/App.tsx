import React from 'react';
import { useAppState } from "hooks/withAppState"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import { SplashScreen } from "components/splash-screen"
import { GameScreen } from "components/game-screen"
import { ResultsScreen } from "components/results-screen"
import { AdminPanel } from 'components/admin-panel';

const options = [
  "eevee",
  "pikachu",
  "snorlax",
  "koffing",
];

function MainGame() {
  const { status } = useAppState();

  if (status === "pending") {
    return <SplashScreen />;
  } else if (status === "running") {
    return <GameScreen options={options} />;
  } else if (status === "complete") {
    return <ResultsScreen options={options} />;
  }

  return null;
}

export function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/healthcheck">
          <h3>App is healthy!</h3>
        </Route>
        <Route exact path="/demo-url">
          <AdminPanel options={options} />
        </Route>
        <Route path="/">
          <MainGame />
        </Route>
      </Switch>
    </Router>
  )
}
