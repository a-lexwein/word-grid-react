import { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './App.css';

import Grid from './components/Grid';
import Options from './components/Options';
import names from '../data/freqs-name.json';

function Main() {
  const { size, freqIndex, seed } = useParams();
  const [currentGuess, setGuess] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [history, updateHistory] = useState([]);

  const submitWord = () => {
    setWordSubmitted(true);  // Signal the word submission event
    updateHistory([...history, currentGuess])
    setGuess('');  // Clear the current guess

    console.log(history)
  };

  const [options, setOptions] = useState({
    nRows: size ? size.split('x')[0] : 4,
    nCols: size ? size.split('x')[1] : 4,
    seed: seed ?? 'hello',
    freqs: freqIndex ? names[freqIndex] : 'TWL 8 - 10'
  });

  return (
    <div className="App">
      <div className="sidebar">
        <Options
          options={options}
          setOptions={setOptions}
        />
      </div>
      <div className="grid-container">
        <Grid
          options={options}
          currentGuess={currentGuess}
          setGuess={setGuess}
          wordSubmitted={wordSubmitted}  // Pass the state variable to Grid
          setWordSubmitted={setWordSubmitted}  // Pass the state setter to Grid
          submitWord={submitWord}
        />
        <div
          className="current-guess"
          onClick={submitWord}
        >
          {currentGuess}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/:size/:freqIndex/:seed"
          element={<Main />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
