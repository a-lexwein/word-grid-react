import seedrandom from 'seedrandom';
import freqs from '../data/freqs.json';
import bagOfLetters from './bagOfLetters';


export default function newBoard(freqs, selectFreqs, nRows, nCols, seed) {
    const random = seedrandom(seed);
    const randomSort = (a,b) => random() - .5; // chatgpt for random sorting an array

    const board = bagOfLetters(freqs, selectFreqs)
        .sort(randomSort)
        .filter((x,i) => i <= nRows * nCols - 1)
        .map((l,i) => ({
            letter: l,
            x: i % 4,
            y: Math.floor(i/4.0)
        }))

    return board
}