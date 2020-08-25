
let beforeRE = /(?<=^|[\(\+\-\*\/])/;
let afterRE = /(?=[\+\-\*\/\)]|$)/;
let dieRE = /(?<count>\d*)d(?<faces>\d+)(?<dropkeep>(?<dk>[dk])(?<lh>[lh])(?<dknum>\d+))?/;
let diceMatch = new RegExp(beforeRE.source + dieRE.source + afterRE.source);

export class RollString {
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
        str = str.replace(/\s+/g, "").toLowerCase();
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
        this.total = parseInt(evaluate(str));
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

let indent = 0;
let indent_mult = 4;

export function evaluate(str) {
    str = str.replace(/\s+/g, "");
    // console.log(`---- EVAL ---- ${str}`);
    indent = 0;
    let result = _evaluate(evalDice(str));
    if (!!Number(result)) {
        return result;
    } else {
        throw new Error(`Did not evaluate to a number: '${result}`);
    }
}


function evalDice(str) {
    str = str.replace(/\s+/g, "");
    // console.log(`     EVAL DICE ---- ${str}`);
    let matched = false;
    /* Replace a matched die string with a rolled die */
    let remaining = str.replace(diceMatch, (match, groups, offset, orig) => {
        matched = true;
        let roll = rollDie(match);
        // console.log(`     ${match} -> ${roll}`);
        return roll;
    });
    if (matched) {
        str = evalDice(remaining);
    } else {
        // console.log(`No more dice found: '${str}'`);
        // throw new Error (`Invalid die syntax: '${str}'`);
    }
    return str;
}


let parensRE = new RegExp(beforeRE.source + /\([^\(\)]*\)/.source + afterRE.source);
let multiRE = new RegExp(beforeRE.source + /(\d+)([\*\/])(\d+)/.source + afterRE.source);
let addRE = new RegExp(beforeRE.source + /(\d+)([\+\-])(\d+)/.source + afterRE.source);

function _evaluate(str) {
    indent += indent_mult;
    let ind = ' '.repeat(indent);
    // console.log(`${ind}PARSING -- ${str}`);

    let found;

    /* Solve Parenthesis */
    found = str.match(parensRE);
    if (found) {
        let firstParen = found.index;
        let lastParen = found.index + found[0].length - 1;
        // console.log(`${ind}`, found);
        if (firstParen >= 0 && lastParen > firstParen) {

            str = str.slice(0, firstParen) + _evaluate(str.slice(firstParen + 1, lastParen)) + str.substr(lastParen + 1);
            // console.log(`${ind}newstr -- ${str}`);
            str = _evaluate(str);
        }
    }

    let val;
    /* Solve Multiplication and Division */
    found = str.match(multiRE);
    if (found) {
        // console.log(`${ind}${found}`);
        switch (found[2]) {
            case '*':
                val = parseInt(found[1]) * parseInt(found[3]);
                break;
            case '/':
                val = parseInt(found[1]) / parseInt(found[3]);
                break;
        }
        let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
        // console.log(`${ind}newstr -- ${newstr}`);
        str = _evaluate(newstr);
    }

    /* Solve Addition and Subtraction */
    found = str.match(addRE);
    if (found) {
        // console.log(`${ind}${found}`);
        switch (found[2]) {
            case '+':
                val = parseInt(found[1]) + parseInt(found[3]);
                break;
            case '-':
                val = parseInt(found[1]) - parseInt(found[3]);
                break;
        }
        let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
        // console.log(`${ind}newstr -- ${newstr}`);
        str = _evaluate(newstr);
    }

    // console.log(`${ind}RETURNING -- ${str}`);
    indent -= indent_mult;
    return str;
}