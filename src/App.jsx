import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './App.css';

import Grid from './components/Grid';
import Scoreboard from './components/Scoreboard';
import Options from './components/Options';
import names from '../data/freqs-name.json';
import wordInList from '../helpers/wordInList';
import score from '../helpers/score';

function Main() {
  const { size, freqIndex, seed } = useParams();
  const [currentGuess, setGuess] = useState('');
  const [timer, setTimer] = useState(120);
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [history, updateHistory] = useState([]);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);
  const optionsModalRef = useRef(null);
  const [gameState, setGameState] = useState('in-game');
  const [last5seconds, setLast5Seconds] = useState(false);
  
  const navigate = useNavigate();

  const defaultFreq = 12;

  const [options, setOptions] = useState({
    nRows: size ? size.split('x')[0] : 8,
    nCols: size ? size.split('x')[1] : 6,
    gameLength: 120,
    seed: seed ?? 'hello',
    freqs: freqIndex ? names[freqIndex] : 'TWL 8 - 10',
    mods: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          if (prevTimer <= 5) setLast5Seconds(true)
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          setGameState('post-game');
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [options]);

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
  
  const handleSetOptions = (newOptions) => {
    setOptions(newOptions);
    setTimer(newOptions.gameLength);
    updateHistory([]);  // Reset the history
    setOptionsModalOpen(false);
    setGuess('');
    setLast5Seconds(false);
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
    navigate(`/${options.nRows}x${options.nCols}/${freqIndex ?? defaultFreq}/${newSeed}`);
    // update game
    handleSetOptions(newOptions);
    setGameState('in-game');
  }

  const handleClickOutside = (event) => {
    if (optionsModalRef.current && !optionsModalRef.current.contains(event.target)) {
      setOptionsModalOpen(false);
    }
    if (optionsModalRef.current && !optionsModalRef.current.contains(event.target)) {
      setOptionsModalOpen(false);
    }
  };

  useEffect(() => {
    if (optionsModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsModalOpen]);


  return (
    <div className="App">
      <div id="title">Basic Orthographic Grid Game</div>
      <div id="button-row">
        <button id="newgame-button" onClick={handleNewGame}>	New Game</button>
        <button id="options-button" onClick={() => setOptionsModalOpen(true)}>	&#x2699;&#xFE0F;</button>
      </div>
      <Scoreboard
        timer={timer}
        history={history}
        handleClickOutside={handleClickOutside}

      />
      <div className="grid-container">
        <Grid
          options={options}
          currentGuess={currentGuess}
          setGuess={setGuess}
          wordSubmitted={wordSubmitted}
          setWordSubmitted={setWordSubmitted}
          submitWord={submitWord}
          gameState={gameState}
          last5Seconds={last5seconds}
        />
        <div
          className="current-guess"
          onClick={submitWord}
        >
          {currentGuess}
        </div>
      </div>

      {optionsModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content" ref={optionsModalRef}>
            <span className="close" onClick={() => setOptionsModalOpen(false)}>&times;</span>
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
