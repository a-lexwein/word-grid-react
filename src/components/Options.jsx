import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import names from '../../data/freqs-name.json';

export default function Options({ options, setOptions }) {
  const [nRowsValue, setNRows] = useState(options.nRows);
  const [nColsValue, setNCols] = useState(options.nCols);
  const [selectFreqsValue, setSelectFreqsValue] = useState(options.freqs);
  const [seedValue, setSeedValue] = useState(options.seed);
  const [mods, setMods] = useState(options.mods);

  const navigate = useNavigate();

  const handleRowsChange = (e) => {
    setNRows(parseInt(e.target.value));
  };

  const handleColsChange = (e) => {
    setNCols(parseInt(e.target.value));
  };

  const handleFreqsChange = (e) => {
    setSelectFreqsValue(e.target.value);
  };

  const handleSeedChange = (e) => {
    setSeedValue(e.target.value);
  };

  const handleModChange = (e) => {
    const { name, checked } = e.target;
    setMods((prevMods) => {
      if (checked) {
        return [...prevMods, name];
      } else {
        return prevMods.filter((mod) => mod !== name);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOptions({
      nRows: nRowsValue,
      nCols: nColsValue,
      freqs: selectFreqsValue,
      seed: seedValue,
      mods: mods,
    });

    navigate(`/${nRowsValue}x${nColsValue}/${names.indexOf(selectFreqsValue)}/${seedValue}`);
  };

  return (
    <form className="options" onSubmit={handleSubmit}>
      <button type="submit">New Board</button>

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

      <label htmlFor="options">Freqs:</label>
      <select id="options" value={selectFreqsValue} onChange={handleFreqsChange}>
        {names.map((x, index) => (
          <option key={index} value={x}>{x}</option>
        ))}
      </select>

      <label htmlFor="seed">Seed</label>
      <input
        type="text"
        id="seed"
        size="20"
        value={seedValue}
        onChange={handleSeedChange}
      />

      <fieldset>
        <legend>Mods</legend>
        <div>
          <input
            type="checkbox"
            id="no_ings"
            name="no_ings"
            onChange={handleModChange}
          />
          <label htmlFor="no_ings">No INGs</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="cvc_checkerboard"
            name="cvc_checkerboard"
            onChange={handleModChange}
          />
          <label htmlFor="cvc_checkerboard">CVC Checkerboard</label>
        </div>
      </fieldset>
    </form>
  );
}
