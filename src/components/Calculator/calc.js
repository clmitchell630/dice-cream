import React, { Component } from 'react';
import NumButton from '../NumButtons/numButton';
import './calc.scss';

class Calculator extends Component {
    state = {
        number: [7, 8, 9, 6, 5, 4, 3, 2, 1, 0]
    }
    render() {
        return (
            <section>
                <input type="text" placeholder="0" maxLength="64"></input>
                <div>
                    <div className="button-row">
                        <NumButton number="7" />
                        <NumButton number="8" />
                        <NumButton number="9" />
                    </div>
                    <div className="button-row">
                        <NumButton number="4" />
                        <NumButton number="5" />
                        <NumButton number="6" />
                    </div>
                    <div className="button-row">
                        <NumButton number="1" />
                        <NumButton number="2" />
                        <NumButton number="3" />
                    </div>
                    <div className="button-row">
                        <NumButton number="0" />
                    </div>
                </div>
            </section>
        )
    }
}

export default Calculator;                 
                 
                 
                 
