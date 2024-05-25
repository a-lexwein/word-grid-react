import React, { useEffect, useState } from 'react';
import Tile from './Tile';

import newBoard from '../../helpers/newBoard';
import freqs from '../../data/freqs.json';

export default function Grid({ options, currentGuess, setGuess }) {

  // const [board, updateBoard] = useState(newBoard(freqs, options.freqs, options.nRows, options.nCols, options.seed));

  const board = newBoard(freqs, options.freqs, options.nRows, options.nCols, options.seed)

  const [liveBoard, updateBoard] = useState(board)

  const handleClick = (id) => {
    // make a deep copy of data
    let copy = JSON.parse(JSON.stringify(liveBoard));
    // get record for clicked tile
    let tile = copy.filter(x => x.id === id)[0];

    console.log(tile);
    // check if clickable, if not do nothing
    if (tile.clickable === false) return;

    console.log('hello?');

    // get make click_order
    let max_click_order = Math.max(...copy.map(x => x.selected_order)) || 0;
    // get currently active tile
    let lastTile = copy.filter(x => max_click_order > 0 && x.selected_order === max_click_order)[0];
    // check if record is neighbor
    let recordIsNeighbor = lastTile === undefined || (Math.abs(lastTile.x - tile.x) <= 1 && Math.abs(lastTile.y - tile.y) <= 1);
    // if not neighor, do nothing
    if (!recordIsNeighbor) return;

    // If the tile is a clickable neighbor, set row to clicked and click_order to max+1
    tile.clickable = false;
    tile.clicked = true;
    tile.selected_order = max_click_order + 1;


    console.log(tile);

    updateBoard(copy);

    setGuess(currentGuess + tile.letter)
}


    useEffect(() => {
        // change number of columns in CSS
        const gameGrid = document.querySelector('.game-grid');
        if (gameGrid) {
          gameGrid.style.gridTemplateColumns = `repeat(${options.nCols}, 1fr)`; 
        }
      }, [options]);



      

    return <div className="game-grid">
    {
        liveBoard.map((x,i,data) => <Tile
          id={i}
          letter={x.letter}
          handleClick={() => handleClick(i)} data={data}
          currentGuess={currentGuess}
        />)
    }
        </div>
}