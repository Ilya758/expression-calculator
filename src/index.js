const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
}

function eval(str) {
    let stackMachine = [];

    str.split(' ').forEach((symb) => {
        if (symb in operations) {
            let [y, x] = [stackMachine.pop(), stackMachine.pop()];

            if (symb === '/' && +y === 0) {
                throw new Error('TypeError: Division by zero.');
            } else {
                stackMachine.push(operations[symb](+x, +y));
            }
        } else {
            stackMachine.push(symb);
        }
    });

    stackMachine.pop();
    return +stackMachine;
}

function expressionCalculator(expr) {

    let output = [],
        stackOps = [],
        lastOp = '';

    expr = expr
        .trim()
        .split(' ')
        .filter((symb) => symb !== ' ')
        .join('')
        .replace(/[0-9]+[0-9]*/g, ` $& `)
        .trim()
        .replace(/[()]/g, ` $& `)
        .split(' ')
        .filter((symb) => symb !== '')
        .join(' ');

    expr.split(' ').forEach((token,) => {
        lastOp = stackOps[stackOps.length - 1];

        if (token in operations && stackOps.length >= 1) {

            for (let l = stackOps.length - 1; l >= 0; l--) {

                if (stackOps[stackOps.length - 1] === '(') {
                    stackOps.push(token);
                    break;
                }

                else if ((token === '*' || token === '/') && (stackOps[stackOps.length - 1] === '+' || stackOps[stackOps.length - 1] === '-')) {
                    stackOps.push(token);
                    return;
                }

                else if ((token === '+' || token === '-') && (stackOps[stackOps.length - 1] === '+' || stackOps[stackOps.length - 1] === '-')) {
                    output.push(stackOps.pop());
                    stackOps.push(token);
                    return;
                }

                else if ((token === '*' || token === '/') && (stackOps[stackOps.length - 1] === '*' || stackOps[stackOps.length - 1] === '/')) {
                    output.push(stackOps.pop());
                    stackOps.push(token);
                    return;
                }
                else {
                    output.push(stackOps.pop());
                }
            }

            if (stackOps.length === 0) {
                stackOps.push(token);
            }
        }

        else if (token in operations || (token === '(')) {
            stackOps.push(token);
        }

        else if (token === ')') {

            if (stackOps.indexOf('(') === -1) {
                throw new Error('ExpressionError: Brackets must be paired')
            }

            for (let l = stackOps.length - 1; l >= 0; l--) {

                if (stackOps[l] === '(') {
                    stackOps.pop();
                    break;
                }
                let lastToken = stackOps.pop();
                output.push(lastToken);
            }
        } else {
            output.push(token);
        }
    });

    if (stackOps.includes('(') || stackOps.includes(')')) {
        throw new Error('ExpressionError: Brackets must be paired')
    }

    for (let i = stackOps.length - 1; i >= stackOps.length - 1; i--) {
        output.push(stackOps.pop());
    }

    return eval(output.join(' '));
}

module.exports = {
    expressionCalculator
}

