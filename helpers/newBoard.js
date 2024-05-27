import seedrandom from 'seedrandom';
import bagOfLetters from './bagOfLetters';


export default function newBoard(freqs, selectFreqs, nRows, nCols, seed) {
    const random = seedrandom(seed + nRows + nCols);
    // const random = seedrandom(seed);
    // const randomSort = (a,b) => Math.random() - .5; // chatgpt for random sorting an array

    

    const bag = bagOfLetters(freqs, selectFreqs)
    const randomElement = (bag) => bag[Math.floor(random() * bag.length)]

    let out = []
    for (let i = 0; i < nCols; ++i) {
      for (let j = 0; j < nRows; ++j) {
        let letter = randomElement(bag)
        let row = {
          letter: letter,
          y:i,
          x:j,
          clicked: false,
          clickable: letter === "_" ? false : true,
          selected_order: 0, //needed 0 in observable version but not sure I'll still need
        }
        out.push(row)
      }
      out = out.map((x,i) => ({...x, id: i}))
    }
    return out.flat()
}