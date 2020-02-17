import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './App.css';

function App() {
  const { data, loading } = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return <p>Loading....</p>;
  }

  return <div className='App'>{JSON.stringify(data)}</div>;
}

export default App;
