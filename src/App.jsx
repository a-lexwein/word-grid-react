import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams} from 'react-router-dom'
import './App.css';


import Grid from './components/Grid';
import Options from './components/Options';

function Main() {
  const { seed } = useParams();
  const [options, setOptions] = useState(
    {
      nRows: 4,  
      nCols: 4,
      seed: seed ?? 'seed',
      freqs: 'TWL 8 - 10'
    }
  );

  return (
    <div className="App">
      <div className="sidebar">
        <Options options={options} setOptions={setOptions}/>
      </div>
      <div className="grid-container">
        <Grid options={options}/>
      </div>
    </div>
    
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/:seed"
        element={<Main />}
      />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
