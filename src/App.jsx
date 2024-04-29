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
      <div className="sidebar">
        <Options options={options} setOptions={setOptions}/>
      </div>
      <div className="grid-container">
        <Grid options={options}/>
      </div>
    </div>
    
  );
}

export default App;
