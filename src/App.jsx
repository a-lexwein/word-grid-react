import { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import './App.css';

import Grid from './components/Grid';
import Options from './components/Options';
import History from './components/History';
import names from '../data/freqs-name.json';
import wordInList from '../helpers/wordInList';
import score from '../helpers/score';

function Main() {
  const { size, freqIndex, seed } = useParams();
  const [currentGuess, setGuess] = useState('');
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [history, updateHistory] = useState([]);

  const submitWord = () => {
    setWordSubmitted(true);  // Signal the word submission event
    let submission = {
      word: currentGuess,
      valid: wordInList(currentGuess),
      score: wordInList(currentGuess) ? score(currentGuess) : 0,
    }
    updateHistory([...history, submission])

    setGuess('');  // Clear the current guess

  };

  const [options, setOptions] = useState({
    nRows: size ? size.split('x')[0] : 4,
    nCols: size ? size.split('x')[1] : 4,
    seed: seed ?? 'hello',
    freqs: freqIndex ? names[freqIndex] : 'TWL 8 - 10'
  });
  
  const handleSetOptions = (newOptions) => {
    setOptions(newOptions);
    updateHistory([]);  // Reset the history
  };

  return (
    <div className="App">
      <div className="sidebar">
        <Options
          options={options}
          setOptions={handleSetOptions}
        />
      </div>
      <div className="grid-container">
        <History history={history}></History>
        <Grid
          options={options}
          currentGuess={currentGuess}
          setGuess={setGuess}
          wordSubmitted={wordSubmitted}
          setWordSubmitted={setWordSubmitted}
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
