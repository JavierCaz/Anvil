import {
  applyCalculatorKey,
  type CalculatorKey,
  type CalculatorState,
  evaluateExpression,
  formatExpression,
  formatResult,
  INITIAL_CALCULATOR,
} from '@/utils/calculator';

/** Press a sequence of keys from the initial state. */
function press(keys: CalculatorKey[], from: CalculatorState = INITIAL_CALCULATOR): CalculatorState {
  return keys.reduce(applyCalculatorKey, from);
}

/** Split a keypad string like "20+2.5" into key presses. */
function type(text: string): CalculatorKey[] {
  return [...text] as CalculatorKey[];
}

describe('evaluateExpression', () => {
  it('evaluates with × and ÷ before + and −', () => {
    expect(evaluateExpression('20+2×2.5')).toBe(25);
    expect(evaluateExpression('100-10÷4')).toBe(97.5);
    expect(evaluateExpression('2×3+4×5')).toBe(26);
    expect(evaluateExpression('10-2-3')).toBe(5);
  });

  it('supports a leading minus', () => {
    expect(evaluateExpression('-5+3')).toBe(-2);
  });

  it('ignores a trailing operator for live previews', () => {
    expect(evaluateExpression('20+')).toBe(20);
  });

  it('hides floating point noise', () => {
    expect(evaluateExpression('0.1+0.2')).toBe(0.3);
  });

  it('returns null for empty input or division by zero', () => {
    expect(evaluateExpression('')).toBeNull();
    expect(evaluateExpression('-')).toBeNull();
    expect(evaluateExpression('5÷0')).toBeNull();
  });
});

describe('applyCalculatorKey', () => {
  it('builds an expression from key presses', () => {
    expect(press(type('20+2.5')).expression).toBe('20+2.5');
  });

  it('replaces an operator pressed right after another', () => {
    expect(press(type('5+×')).expression).toBe('5×');
  });

  it('only allows a leading minus before the first number', () => {
    expect(press(type('+×')).expression).toBe('');
    expect(press(type('-5')).expression).toBe('-5');
  });

  it('allows one decimal point per number and prefixes a bare point with 0', () => {
    expect(press(type('.5')).expression).toBe('0.5');
    expect(press(type('1.2.3')).expression).toBe('1.23');
    expect(press(type('1.5+.5')).expression).toBe('1.5+0.5');
  });

  it('drops leading zeros', () => {
    expect(press(type('007')).expression).toBe('7');
    expect(press(type('5+0')).expression).toBe('5+0');
    expect(press(type('5+07')).expression).toBe('5+7');
  });

  it('deletes and clears', () => {
    expect(press([...type('123'), 'backspace']).expression).toBe('12');
    expect(press([...type('123'), 'clear'])).toEqual(INITIAL_CALCULATOR);
  });

  it('replaces the expression with its result on equals', () => {
    const state = press([...type('20+2×2.5'), 'equals']);
    expect(state).toEqual({ expression: '25', evaluated: true });
  });

  it('starts over with a digit after equals, but continues with an operator', () => {
    const result = press([...type('2+3'), 'equals']);
    expect(press(type('7'), result).expression).toBe('7');
    expect(press(type('×2'), result).expression).toBe('5×2');
    expect(press(['backspace'], result).expression).toBe('');
  });

  it('ignores equals without an operation or with an invalid one', () => {
    const plain = press(type('42'));
    expect(applyCalculatorKey(plain, 'equals')).toBe(plain);
    const divByZero = press(type('5÷0'));
    expect(applyCalculatorKey(divByZero, 'equals')).toBe(divByZero);
  });
});

describe('formatting', () => {
  it('spaces operators and uses a typographic minus', () => {
    expect(formatExpression('20+2.5×4')).toBe('20 + 2.5 × 4');
    expect(formatExpression('-5-3')).toBe('−5 − 3');
    expect(formatExpression('5+')).toBe('5 +');
  });

  it('formats results as plain decimals', () => {
    expect(formatResult(25)).toBe('25');
    expect(formatResult(0.0000001)).toBe('0.0000001');
  });
});
