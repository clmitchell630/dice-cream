import React, { Component } from 'react';
import './app.scss';
import Calculator from './components/Calculator/calc';

class App extends Component {

  render() {
    return (
      <div>
        <Calculator />
      </div>
    );
  }
}

export default App;
