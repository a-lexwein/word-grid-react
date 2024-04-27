import './App.css';
import { useEffect, useState } from 'react';
import Grid from './components/Grid';
import randomElement from '../helpers/randomElement';
import bagOfLetters from '../helpers/bagOfLetters';

function App() {
  const [board] = useState(['a', 'b', 'c'])
  return (
    <div className="App">
      <header className="App-header">
        {randomElement()}
        <Grid board={board}></Grid>
      </header>
      
    </div>
  );
}

export default App;
