import words from '../data/wordnik.json';

export default function wordInList(word) {
    return words.includes(word.toLowerCase())
}