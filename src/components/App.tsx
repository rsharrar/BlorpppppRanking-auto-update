import React from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import HomePage from './routes/home/HomePage';
import settings from '../../settings';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
