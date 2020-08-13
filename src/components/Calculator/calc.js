import React, { Component } from 'react';
import NumButton from '../NumButtons/numButton';
import './calc.scss';

class Calculator extends Component {
    state = {
        number: [1,2,3,4,5,6,7,8,9,0]
    }
    render() {
        return (
            <section>
                <input type="text" placeholder="0" maxLength="15"></input>
                <div>
                    {this.state.number.map(num => (
                        <NumButton number={num} />
                    ))}
                </div>
            </section>
        )
    }
}

export default Calculator;