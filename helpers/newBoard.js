import seedrandom from 'seedrandom';
import bagOfLetters from './bagOfLetters';

const neighbors = (tile, board) => board.filter(x => (Math.abs(tile.x - x.x) <= 1 && Math.abs(tile.y - x.y) <= 1));
const isVowel = x => ['A','E','I','O', 'U'].includes(x.toUpperCase());

const hasING = (board) => board
    .filter(x => x.letter === "N")
    .map(x => neighbors(x, board).map(y => y.letter))
    .some(x => x.includes("I") && x.includes("G"))


function newBoardNoMods(freqs, selectFreqs, nRows, nCols, random) {
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
        point_value: 1,
      }
      out.push(row)
    }
    out = out.map((x,i) => ({...x, id: i}))
  }
  return out.flat()
}

export default function newBoard(freqs, selectFreqs, nRows, nCols, seed, mods) {
    let modsInternal = mods ?? []
    const random = seedrandom(seed + nRows + nCols);
    const randomElement = (bag) => bag[Math.floor(random() * bag.length)]
    // const random = seedrandom(seed);
    // const randomSort = (a,b) => Math.random() - .5; // chatgpt for random sorting an array
    let board = newBoardNoMods(freqs, selectFreqs, nRows, nCols, random)
    
    while (modsInternal.includes('no_ings') && hasING(board)) {
      board = newBoardNoMods(freqs, selectFreqs, nRows, nCols, random)
    }
    if (modsInternal.includes('cvc_checkerboard')) {
      for (const tile of board) {
        while(isVowel(tile.letter) && (tile.x + tile.y) % 2 === 0) tile.letter  = randomElement(bagOfLetters(freqs, selectFreqs))
        while(!isVowel(tile.letter) && (tile.x + tile.y) % 2 === 1) tile.letter  = randomElement(bagOfLetters(freqs, selectFreqs))
      }
    }
    return board
}