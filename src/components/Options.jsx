import React, { useState } from 'react';
import names from '../../data/freqs-name.json';

export default function Options() {
    // this started as GPT asking for a form with 2 range sliders
  const [nRowsValue, setNRows] = useState(5);
  const [nColsValue, setNCols] = useState(7);
  const [selectFreqsValue, setSelectFreqsValue] = useState('TWL 8 - 10')

  const handleRowsChange = (e) => {
    setNRows(parseInt(e.target.value));
  };

  const handleColsChange = (e) => {
    setNCols(parseInt(e.target.value));
  };

  const handleFreqsChange = (e) => {
    setSelectFreqsValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the slider values, like sending them to an API or processing them
    console.log("Slider 1 value:", nRowsValue);
    console.log("Slider 2 value:", nColsValue);
    console.log("Freq", selectFreqsValue);
  };

  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="options">Select an option:</label>
        <select id="options" value={selectFreqsValue} onChange={handleFreqsChange}>
            {names.map(x => <option value={x}>{x}</option>)}
            
            
        </select>
      <label htmlFor="nRows">{nRowsValue} rows</label>
      <input
        type="range"
        id="nRows"
        name="nRows"
        min="2"
        max="12"
        step="1"
        value={nRowsValue}
        onChange={handleRowsChange}
      />

      <label htmlFor="nCols">{nColsValue} columns</label>
      <input
        type="range"
        id="nCols"
        name="nCols"
        min="2"
        max="12"
        step="1"
        value={nColsValue}
        onChange={handleColsChange}
      />

      <button type="submit">New Board</button>
    </form>
  );
}

