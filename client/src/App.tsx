import React from 'react';
import './App.css';
import { useHelloQuery } from './generated/graphql';

function App() {
  const { data, loading } = useHelloQuery();

  if (loading || !data) {
    return <p>Loading....</p>;
  }

  return <div className='App'>{data.hello}</div>;
}

export default App;
