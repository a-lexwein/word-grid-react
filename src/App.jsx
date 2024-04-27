import './App.css';
import { useEffect, useState } from 'react';
import Grid from './components/Grid';
import Options from './components/Options';
import randomElement from '../helpers/randomElement';
import bagOfLetters from '../helpers/bagOfLetters';

function App() {
  const [board] = useState(['a', 'b', 'c'])
  return (
    <div className="App">
      <header className="App-header">
        <Options/>
        {randomElement()}
        <Grid board={board}/>
      </header>
      
    </div>
  );
}

export default App;
