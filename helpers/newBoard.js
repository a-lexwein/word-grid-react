export default function newBoard(freqs, selectFreqs) {
    return freqs
        .filter(x => x.name === selectFreqs)
        .flatMap(x => Array(x.freq).fill(x.letter))
        .map(x => x === "Q" ? "Qu" : x)
}