import seedrandom from 'seedrandom';
import freqs from '../data/freqs.json';
import bagOfLetters from './bagOfLetters';

const random = seedrandom('seed');

const randomSort = (a,b) => random() - .5; // chatgpt

export default function randomElement() {
    const bag = bagOfLetters(freqs, 'TWL 6 & 7 Uniques')
    return bag.sort(randomSort)[0]


}

export default function newBoard(freqs, selectFreqs) {
    const bag = bagOfLetters(freqs, selectFreqs)
    return bag.sort(randomSort)[0]
}