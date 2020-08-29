import React from 'react';
import Roll from './Rolls';
import './historyLine.scss';

export default class HistoryLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let line = this.props.line;
        let lineEle = [];
        line.outputString.split("#").forEach((s, i) => {
            lineEle.push(s);
            if (i < line.rolls.length) {
                lineEle.push(
                    <Roll roll={line.rolls[i]} />
                );
            }
        });
        return lineEle;
    }
}