import React, { Component } from 'react';
// import React from 'react';
import NumButton from '../NumButtons/numButton';
import History from '../History/history';
import './calc.scss';
import RollString from '../Parser/parser';

export default class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: "",
            savedValue: "",
            history: [
                new RollString("2+2"),
                new RollString("d20"),
                new RollString("d20+d6"),
                new RollString("2d20+2d6+5"),
              ],
        };
    }

    handleClick = (event) => {
        let btnValue = event.target.getAttribute("value");
        this.setState(prevState => ({
            screen: prevState.screen + btnValue
        }));
    }

    evaluate = (event) => {
        let str = this.state.screen;
        console.log(`INPUT - ${str}`);
        let result = new RollString(str);
        console.log(`RESULT - ${result.total}`);
        this.setState(prevState => ({
            screen: result.total,
            history: [...prevState.history, result],
        }))
    }

    clearField = (event) => {
        this.setState({ screen: "" });
    }

    render() {
        return (
            <div>
                <History history={this.state.history} />
                <section>
                    <input
                        id="inputVal"
                        type="text"
                        value={this.state.screen}
                        onChange={e => { console.log(this.state.screen); this.setState({ screen: e.target.value }) }}
                        placeholder=""
                        maxLength="64"
                    >
                    </input>
                    <NumButton number="7" handleClick={this.handleClick} />
                    <NumButton number="8" handleClick={this.handleClick} />
                    <NumButton number="9" handleClick={this.handleClick} />
                    <NumButton number="4" handleClick={this.handleClick} />
                    <NumButton number="5" handleClick={this.handleClick} />
                    <NumButton number="6" handleClick={this.handleClick} />
                    <NumButton number="1" handleClick={this.handleClick} />
                    <NumButton number="2" handleClick={this.handleClick} />
                    <NumButton number="3" handleClick={this.handleClick} />
                    <NumButton number="0" handleClick={this.handleClick} />
                    <NumButton number="d" handleClick={this.handleClick} />

                    <NumButton number="C" handleClick={this.clearField} />
                    <NumButton number="/" className="operator" handleClick={this.handleClick} />
                    <NumButton number="*" className="operator" handleClick={this.handleClick} />
                    <NumButton number="-" className="operator" handleClick={this.handleClick} />
                    <NumButton number="+" className="operator" handleClick={this.handleClick} />
                    <NumButton number="=" className="operator" handleClick={this.evaluate} />
                </section>
            </div>
        )
    }
}
