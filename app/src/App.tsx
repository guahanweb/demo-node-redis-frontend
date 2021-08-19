import React, { useEffect, useState } from 'react';
import { useVoting, useVotingResults } from "hooks/withVoting"

function App() {
  const voting: any = useVoting();
  const results: any = useVotingResults();

  return (
    <div className="App">
      <div className="controls">
        <VotingOption choice="smile" />
        <VotingOption choice="frown" />
      </div>
      <div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
        <button className="btn btn-outline-danger" onClick={() => voting.reset()}>reset</button>
      </div>
    </div>
  );
}

function VotingOption({ choice }: { choice: string }) {
  const voting: any = useVoting();
  const results: any = useVotingResults();
  const [ pct, setPct ] = useState(0);

  useEffect(function () {
    if (results) {
      const value = results.votes && results.votes[choice];
      if (value) {
        // calculate the percentage of votes
        setPct(Math.round(value / results.total * 100));
      } else {
        setPct(0);
      }
    }
  }, [results, choice]);

  return (
    <div className="voting-option">
      <div className="control">
        <button className="btn btn-primary" onClick={() => voting.vote(choice)}>{choice}</button>
      </div>
      <div className="percentage">
        <div className="wrapper">
          <div className="bar" style={{ width: `${pct}%`}}></div>
        </div>
        <div className="value">{pct}%</div>
      </div>
    </div>
  )
}

export default App;
