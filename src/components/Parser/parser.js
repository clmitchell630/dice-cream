
function eval_parens(str) {

}

let indent = 0;
let indent_mult = 4;

export function evaluate(str) {
    console.log(`---- EVAL ---- ${str}`);
    indent = 0;
    return _evaluate(str);
}

function _evaluate(str) {
    indent += indent_mult;
    let ind = ' '.repeat(indent);
    console.log(`${ind}PARSING -- ${str}`);

    let found;

    /* Solve Parenthesis */
    // while (str.match(/[\(\)]/)) {
        // console.log(found);
        let firstParen = str.indexOf("(");
        let lastParen = str.lastIndexOf(")");
        if (firstParen >= 0 && lastParen > firstParen) {
            str = str.slice(0, firstParen) + _evaluate(str.slice(firstParen + 1, lastParen)) + str.substr(lastParen + 1);
            console.log(`${ind}newstr -- ${str}`);
        }
    // }

    let val;
    /* Solve Multiplication and Division */
    // while (str.match(/[\*\/]/)) {
        found = str.match(/(\d+)([\*\/])(\d+)/);
        if (found) {
            console.log(`${ind}${found}`);
            switch (found[2]) {
                case '*':
                    val = parseInt(found[1]) * parseInt(found[3]);
                    break;
                case '/':
                    val = parseInt(found[1]) / parseInt(found[3]);
                    break;
            }
            let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
            console.log(`${ind}newstr -- ${newstr}`);
            str = _evaluate(newstr);
        }
    // }

    /* Solve Addition and Subtraction */
    // while (str.match(/[\+\-]/)) {
        found = str.match(/(\d+)([\+\-])(\d+)/);
        if (found) {
            console.log(`${ind}${found}`);
            switch (found[2]) {
                case '+':
                    val = parseInt(found[1]) + parseInt(found[3]);
                    break;
                case '-':
                    val = parseInt(found[1]) - parseInt(found[3]);
                    break;
            }
            let newstr = str.slice(0, found.index) + val + str.substr(found.index + found[0].length)
            console.log(`${ind}newstr -- ${newstr}`);
            str = _evaluate(newstr);
        }
    // }


    console.log(`${ind}RETURNING -- ${str}`);
    indent -= indent_mult;
    return str;
}