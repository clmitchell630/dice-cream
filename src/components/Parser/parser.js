
import Mexp from 'math-expression-evaluator';

let beforeRE = /(?<=^|[\(\+\-\*\/])/;
let afterRE = /(?=[\+\-\*\/\)]|$)/;
let dieRE = /(?<count>\d*)d(?<faces>\d+)(?<dropkeep>(?<dk>[dk])(?<lh>[lh])(?<dknum>\d+))?/;
let diceMatch = new RegExp(beforeRE.source + dieRE.source + afterRE.source);

export default class RollString {
    /* DATA STRUCTURE
    {
        input: "2d6dl1+1d20+5",
        rolls: [
            Roll,
            Roll,
        ]
        total: x,
        outputString: "#+#+5";
    }
    */
    constructor(str) {
        str = str.toString().replace(/\s+/g, "").toLowerCase();
        this.input = str;
        /* 
        Find the rolls within the string. 
        Tokenize with '#' and add the Roll to the rolls[]
        */
        this.rolls = [];
        let matched = true;
        while (matched) {
            matched = false;
            str = str.replace(diceMatch, (match, groups, offset, orig) => {
                matched = true;
                let roll = new Roll(match);
                this.rolls.push(roll);
                return "#";
            });
        }
        /* Tokenized string corresponding to Rolls in this.rolls */
        this.outputString = str;

        /* Insert the rolled values in to the string and evaluate */
        let idx = 0;
        str = str.replace(/#/g, (match) => {
            return this.rolls[idx++].total;
        });
        this.total = Mexp.eval(str);
    }

    toString() {
        let idx = 0;
        let outStr = this.outputString.replace(/#/g, (match) => {
            return this.rolls[idx++].total;
        });
        return `${this.input} -> ${outStr}`;
    }
}

class Roll {
    /* DATA STRUCTURE
    {
        roll: "2d6dl1",
        count: 2
        faces: 6
        results: [
            {value: 3, drop:true},
            {value: 6},
        ],
        total:6,
    }
    */
    constructor(str) {
        this.roll = str;
        this.results = [];
        this.total = this._rollDie(str, this.results);
    }

    _rollDie(str, res) {
        let matches = str.match(diceMatch);
        this.count = parseInt(matches.groups.count) || 1;
        this.faces = parseInt(matches.groups.faces);
        let rolls = [];

        for (let i = 0; i < this.count; i++) {
            rolls.push(Math.ceil(Math.random() * this.faces));
        }
        rolls.sort((a, b) => a - b);
        rolls.forEach(a => res.push({ value: a }));
        if (matches.groups.dk) {
            let dkNum = parseInt(matches.groups.dknum);
            if (dkNum >= this.count) {
                /* Can't drop/keep (more than) all the dice! */
                throw new Error(`Cannot drop/keep '${dkNum}' out of '${this.count}' dice!`);
            };
            let start = 0;
            let end = 0;
            switch (matches.groups.dk + matches.groups.lh) {
                case 'dl':
                    start = 0;
                    end = dkNum;
                    break;
                case 'dh':
                    start = rolls.length - dkNum;
                    end = rolls.length;
                    break;
                case 'kl':
                    start = dkNum;
                    end = rolls.length;
                    break;
                case 'kh':
                    start = 0;
                    end = rolls.length - dkNum;
                    break;
                default:
                    throw new Error(`Invalid drop/keep`);
            }
            for (let i = start; i < end; i++) {
                res[i].drop = true;
            }
        }
        /* Sum the dice unless they are dropped */
        return res.reduce((acc, cur) => {
            if (cur.drop) return acc;
            return acc + cur.value;
        }, 0);
    }
}
