import React, { useEffect, useState } from 'react';
import Tile from './Tile';

import newBoard from '../../helpers/newBoard';
import freqs from '../../data/freqs.json';

export default function Grid({ options }) {
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);

    useEffect(() => {
        // WaKe Lock VIA chatgpt
        // Select the element with the class 'game-grid' using a ref
        const gameGrid = document.querySelector('.game-grid');
        
        // Override the grid-template-columns property
        if (gameGrid) {
          gameGrid.style.gridTemplateColumns = `repeat(${options.nCols}, 1fr)`; 
        }

        let wakeLock = null;

        async function requestWakeLock() {
          try {
            if ('wakeLock' in navigator) {
              // Request a screen wake lock
              wakeLock = await navigator.wakeLock.request('screen');
              setWakeLockEnabled(true);
            }
          } catch (error) {
            console.error('Failed to request wake lock:', error);
          }
        }
        // Request wake lock when component mounts
        requestWakeLock();

        // Release wake lock when component unmounts
        return () => {
          if (wakeLock) {
            wakeLock.release();
            setWakeLockEnabled(false);
          }
    };


      }, [options]); // Run this effect only once after the component mounts

      

    return <div className="game-grid">
    {
        newBoard(freqs, options.freqs, options.nRows, options.nCols, options.seed)
            .map(x => <Tile letter={x.letter}/>)
    }
        </div>
}