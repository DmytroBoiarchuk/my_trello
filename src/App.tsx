import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CardEditModalBig from './pages/Board/components/ModalCreating/CardEditModalBig';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/board/:board_id" element={<Board />}>
              <Route path="/board/:board_id/card/:card_id/"></Route>
            </Route>
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
