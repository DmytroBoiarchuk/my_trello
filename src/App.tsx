import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Home boards={[]} />}></Route>
            <Route path="/board/:board_id" element={<Board />}></Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
