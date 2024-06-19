import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
  const [timer, setTimer] = useState(60);
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [history, updateHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    nRows: size ? size.split('x')[0] : 8,
    nCols: size ? size.split('x')[1] : 6,
    gameLength: 60,
    seed: seed ?? 'hello',
    freqs: freqIndex ? names[freqIndex] : 'TWL 8 - 10',
    mods: [],
  });
  
  const handleSetOptions = (newOptions) => {
    setOptions(newOptions);
    setTimer(newOptions.gameLength);
    updateHistory([]);  // Reset the history
    setModalOpen(false);
  };

  const handleNewGame = () => {
    // add random string to seed
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newSeed = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newSeed += characters[randomIndex];
    }

    const newOptions = {
      ...options,
      seed: newSeed,
    }
    // update url
    navigate(`/${options.nRows}x${options.nCols}/${freqIndex}/${newSeed}`);
    // update game
    handleSetOptions(newOptions);
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  return (
    <div className="App">
      <div id="title">Basic Orthographic Grid Game</div>
      <button id="newgame-button" onClick={handleNewGame}>	New Game</button>
      <button id="options-button" onClick={() => setModalOpen(true)}>	&#x2699;&#xFE0F;</button>
      <div className="grid-container">
        <div>&#x1F551; {timer}</div>
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

      {modalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <Options
              options={options}
              setOptions={handleSetOptions}
            />
          </div>
        </div>
      )}
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
