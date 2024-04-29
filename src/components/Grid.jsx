import React, { useEffect } from 'react';
import Tile from './Tile';

import newBoard from '../../helpers/newBoard';
import freqs from '../../data/freqs.json';

export default function Grid( { options }) {
    useEffect(() => {
        // Via GPT
        // Select the element with the class 'game-grid' using a ref
        const gameGrid = document.querySelector('.game-grid');
        
        // Override the grid-template-columns property
        if (gameGrid) {
          gameGrid.style.gridTemplateColumns = `repeat(${options.nCols}, 1fr)`; 
        }
      }, [options]); // Run this effect only once after the component mounts

    return <div className="game-grid">
    {
        newBoard(freqs, options.freqs, options.nRows, options.nCols, options.seed)
            .map(x => <Tile letter={x.letter}/>)
    }
        </div>
}