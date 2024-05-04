import seedrandom from 'seedrandom';
import bagOfLetters from './bagOfLetters';


export default function newBoard(freqs, selectFreqs, nRows, nCols, seed) {
    const random = seedrandom(seed);
    // const randomSort = (a,b) => Math.random() - .5; // chatgpt for random sorting an array

    

    const bag = bagOfLetters(freqs, selectFreqs)
    const randomElement = (bag) => bag[Math.floor(random() * bag.length)]

    let out = []
    for (let i = 0; i < nCols; ++i) {
      for (let j = 0; j < nRows; ++j) {
        let row = {
          letter:randomElement(bag),
          y:i,
          x:j,
        }
        out.push(row)
      }
    }
    return out.flat()
}