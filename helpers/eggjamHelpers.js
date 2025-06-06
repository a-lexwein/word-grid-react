import _ from 'lodash';
import freqs from '../data/freqs.json';
import bagOfLetters from './bagOfLetters';


const randomSort = (a,b) => Math.random() - .5; // chatgpt

export function randomElement() {
    const bag = bagOfLetters(freqs, 'TWL 6 & 7 Uniques')
    return bag.sort(randomSort)[0]


}

export function newStartingLetters(nRows) {
  
  let arr = []

  for (let i = 0; i < nRows; ++i) {
    // randomly place 1,2,or 3
    let nLettersInRow = _.sample([2]) // might be too many 3s
    let row = _.shuffle([-60, -30, 0, 30, 60])
      .slice(0,nLettersInRow)
      .map(x => ({
        x: x,
        y: 120 + i * 40,
        letter: randomElement(),
        selected: false,
      }))
    arr.push(row) 
  }
  return arr.flat()
}

export function newRow(y) {
  let nLettersInRow = _.sample([2])
  let row = _.shuffle([-60, -30, 0, 30, 60])
  .slice(0,nLettersInRow)
  .map(x => ({
    x: x,
    y: y,
    letter: randomElement(),
    selected: false,
  }))
  return row
}

export function rowsInLetters(letters) {
  // find number of y values.
  let ys = new Set(letters.map(d => d.y))
  return ys.size
}