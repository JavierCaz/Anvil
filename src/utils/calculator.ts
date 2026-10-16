/**
 * Minimal four-function calculator used by the workout tools' converter.
 *
 * The expression is kept as a plain string of digits, `.` and the operators
 * below, edited one keypad press at a time (`applyCalculatorKey`) and evaluated
 * with normal precedence (`evaluateExpression`) — never through `eval`.
 */

export type CalculatorOperator = '+' | '-' | '×' | '÷';

export type CalculatorKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | CalculatorOperator
  | 'backspace'
  | 'clear'
  | 'equals';

export interface CalculatorState {
  expression: string;
  /**
   * The expression is the result of `=` — typing a digit starts a new
   * expression, while an operator keeps calculating with the result.
   */
  evaluated: boolean;
}

export const INITIAL_CALCULATOR: CalculatorState = { expression: '', evaluated: false };

/** Longest expression accepted from the keypad. */
export const CALCULATOR_MAX_LENGTH = 32;

/** Significant digits kept in results, hiding float noise like 0.1 + 0.2. */
const RESULT_PRECISION = 12;

/** Results beyond this magnitude are rejected rather than shown in exponent notation. */
const RESULT_MAX = 1e15;

const OPERATORS: readonly string[] = ['+', '-', '×', '÷'];

export function isOperator(char: string): char is CalculatorOperator {
  return OPERATORS.includes(char);
}

/** The number currently being typed (text after the last operator). */
function currentNumber(expression: string): string {
  let start = expression.length;
  while (start > 0 && !isOperator(expression[start - 1])) {
    start--;
  }
  return expression.slice(start);
}

/** Apply one keypad press to the calculator. */
export function applyCalculatorKey(state: CalculatorState, key: CalculatorKey): CalculatorState {
  if (key === 'clear') {
    return INITIAL_CALCULATOR;
  }
  if (key === 'backspace') {
    return { expression: state.evaluated ? '' : state.expression.slice(0, -1), evaluated: false };
  }
  if (key === 'equals') {
    const result = evaluateExpression(state.expression);
    if (result === null || !hasOperator(state.expression)) {
      return state;
    }
    return { expression: formatResult(result), evaluated: true };
  }

  // After `=`, a digit or decimal point starts over; an operator continues.
  const expression = state.evaluated && !isOperator(key) ? '' : state.expression;
  const last = expression.at(-1) ?? '';

  if (isOperator(key)) {
    if (expression === '' || expression === '-') {
      // Only a leading minus is allowed before any number.
      return key === '-' ? { expression: '-', evaluated: false } : state;
    }
    // Pressing an operator right after another one replaces it.
    const base = isOperator(last) ? expression.slice(0, -1) : expression;
    return withLimit(state, `${base}${key}`);
  }

  const number = currentNumber(expression);
  if (key === '.') {
    if (number.includes('.')) {
      return state.evaluated ? { expression, evaluated: false } : state;
    }
    return withLimit(state, `${expression}${number === '' || number === '-' ? '0' : ''}.`);
  }

  // Digits: no leading zeros ("007" → "7").
  if (number === '0') {
    return withLimit(state, `${expression.slice(0, -1)}${key}`);
  }
  return withLimit(state, `${expression}${key}`);
}

function withLimit(state: CalculatorState, expression: string): CalculatorState {
  if (expression.length > CALCULATOR_MAX_LENGTH) {
    return state;
  }
  return { expression, evaluated: false };
}

/** Whether the expression has an operation in it (a leading minus doesn't count). */
export function hasOperator(expression: string): boolean {
  return [...expression.slice(1)].some(isOperator);
}

/**
 * Evaluate an expression with × and ÷ binding tighter than + and −. A trailing
 * operator is ignored so the result can be previewed while typing. Returns
 * null for an empty/invalid expression or a division by zero.
 */
export function evaluateExpression(expression: string): number | null {
  let text = expression;
  if (text !== '' && isOperator(text.at(-1) ?? '')) {
    text = text.slice(0, -1);
  }
  if (text === '' || text === '-') {
    return null;
  }

  // Split into numbers and the operators between them; a leading minus signs the first number.
  const numbers: number[] = [];
  const operators: CalculatorOperator[] = [];
  let token = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isOperator(char) && !(i === 0 && char === '-')) {
      numbers.push(Number(token));
      operators.push(char);
      token = '';
    } else {
      token += char;
    }
  }
  numbers.push(Number(token));
  if (numbers.some((n) => !Number.isFinite(n)) || token === '' || token === '-') {
    return null;
  }

  // First pass: × and ÷.
  const terms: number[] = [numbers[0]];
  const additive: CalculatorOperator[] = [];
  for (let i = 0; i < operators.length; i++) {
    const op = operators[i];
    const next = numbers[i + 1];
    if (op === '×') {
      terms[terms.length - 1] *= next;
    } else if (op === '÷') {
      if (next === 0) {
        return null;
      }
      terms[terms.length - 1] /= next;
    } else {
      terms.push(next);
      additive.push(op);
    }
  }

  // Second pass: + and −.
  let result = terms[0];
  for (let i = 0; i < additive.length; i++) {
    result = additive[i] === '+' ? result + terms[i + 1] : result - terms[i + 1];
  }
  if (!Number.isFinite(result) || Math.abs(result) >= RESULT_MAX) {
    return null;
  }
  return Number(result.toPrecision(RESULT_PRECISION));
}

/** Plain-decimal text for a result, so it can be edited further from the keypad. */
export function formatResult(value: number): string {
  const text = String(value);
  if (!text.includes('e')) {
    return text;
  }
  // Tiny values (1e-7) — expand, dropping digits past the 10th decimal.
  return value.toFixed(10).replace(/\.?0+$/, '');
}

/** Expression for display: spaced operators and a typographic minus ("20 + 2.5 × 4"). */
export function formatExpression(expression: string): string {
  return [...expression]
    .map((char, index) => {
      if (!isOperator(char)) {
        return char;
      }
      const symbol = char === '-' ? '−' : char;
      return index === 0 ? symbol : ` ${symbol} `;
    })
    .join('')
    .trimEnd();
}
