import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Header from './Header';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;