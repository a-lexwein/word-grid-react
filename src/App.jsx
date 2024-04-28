import './App.css';
import { useEffect, useState } from 'react';
import Grid from './components/Grid';
import Options from './components/Options';
import randomElement from '../helpers/randomElement';
import bagOfLetters from '../helpers/bagOfLetters';

function App() {

  const [options, setOptions] = useState(
    {
      nRows: 4,  
      nCols: 4,
      seed: 'seed',
      freqs: 'TWL 8 - 10'
    }
  );


  return (
    <div className="App">
      <header className="App-header">
        <Options options={options} setOptions={setOptions}/>
        <Grid options={options}/>
      </header>
      
    </div>
  );
}

export default App;
