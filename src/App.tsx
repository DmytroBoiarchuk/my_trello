import React, { JSX } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CardModal from './pages/Board/components/Modals/CardModal';
import Login from './pages/Authorization/Login/Login';

function App(): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/board/:boardId/*" element={<Board />}>
              <Route path="card/:cardId/" element={<CardModal />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
