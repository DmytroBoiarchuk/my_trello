import React, { JSX } from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Board from './pages/Board/Board';
import Home from './pages/Home/Home';
import CardModal from './pages/Board/components/Modals/CardModal';
import Login from './pages/Authorization/Login/Login';
import { RootState } from './store/store';
import PageNotfound from './pages/Home/components/PAgeNotFound/PageNotfound';

function App(): JSX.Element {
  const isAuthorized = useSelector((state: RootState) => state.user.isAuthorized);

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            {isAuthorized ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/board/:boardId/*" element={<Board />}>
                  <Route path="card/:cardId/" element={<CardModal />} />
                </Route>
              </>
            ) : (
              <>
                <Route path="/*" element={<Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </>
            )}
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageNotfound />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
