import React from 'react';
import logo from './logo.svg';
import { useVoting, useVotingResults } from "hooks/withVoting"

function App() {
  const voting: any = useVoting();
  const results: any = useVotingResults();

  return (
    <div className="App">
      <div className="controls">
        <button onClick={() => voting.vote("smile")}>smile</button>
        <button onClick={() => voting.vote("frown")}>frown</button>
      </div>
      <div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
