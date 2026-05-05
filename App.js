import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [evaluatedResult, setEvaluatedResult] = useState(null);

  const handleNumberPress = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (nextOp) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(`${display} ${nextOp}`);
      setEvaluatedResult(null);
    } else if (operation) {
      // If user has not started entering the next operand yet
      if (!waitingForOperand) {
        const result = calculate(previousValue, inputValue, operation);
        setEvaluatedResult(result);
        setPreviousValue(result);
        // Keep full expression history visible; do not collapse to intermediate totals.
        if (history) {
          setHistory(`${history} ${display} ${nextOp}`);
        } else {
          setHistory(`${previousValue} ${operation} ${display} ${nextOp}`);
        }
        setDisplay('');
      } else {
        // change the trailing operator in history
        if (history) {
          const newHistory = history.replace(/\s[+\-×÷]$/, ` ${nextOp}`);
          setHistory(newHistory);
        } else {
          setHistory(`${previousValue} ${nextOp}`);
        }
        setOperation(nextOp);
        return;
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setEvaluatedResult(result);
      setHistory('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
    setEvaluatedResult(null);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Main display text: show the expression as it grows; do not auto-compute while typing the next number
  const mainDisplayText = history
    ? `${history}${!waitingForOperand && display ? ` ${display}` : ''}`
    : display;

  const formatResult = (value) => {
    if (value === null || value === undefined) return '';
    if (!isFinite(value) || isNaN(value)) return 'Error';
    return Number.isInteger(value)
      ? String(value)
      : String(parseFloat(value.toFixed(8)).toString());
  };

  const liveResultText = (() => {
    if (previousValue === null || !operation) return '';

    // Keep showing last evaluated subtotal immediately after operator press.
    if (waitingForOperand) {
      return formatResult(evaluatedResult);
    }

    // While typing next operand, continuously show preview of the new result.
    const inputValue = parseFloat(display);
    if (isNaN(inputValue)) return '';
    return formatResult(calculate(previousValue, inputValue, operation));
  })();

  const Button = ({ onPress, title, style }) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.calculator}>
        <View style={styles.displayContainer}>
          <Text
            style={styles.display}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.35}
          >
            {mainDisplayText}
          </Text>
          {liveResultText ? (
            <Text style={styles.liveResult} numberOfLines={1} ellipsizeMode="tail">
              {liveResultText}
            </Text>
          ) : null}
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.row}>
            <Button
              title="C"
              onPress={handleClear}
              style={styles.functionButton}
            />
            <Button
              title="←"
              onPress={handleBackspace}
              style={styles.functionButton}
            />
            <Button
              title="÷"
              onPress={() => handleOperation('÷')}
              style={styles.operationButton}
            />
            <Button
              title="×"
              onPress={() => handleOperation('×')}
              style={styles.operationButton}
            />
          </View>

          <View style={styles.row}>
            <Button
              title="7"
              onPress={() => handleNumberPress(7)}
            />
            <Button
              title="8"
              onPress={() => handleNumberPress(8)}
            />
            <Button
              title="9"
              onPress={() => handleNumberPress(9)}
            />
            <Button
              title="-"
              onPress={() => handleOperation('-')}
              style={styles.operationButton}
            />
          </View>

          <View style={styles.row}>
            <Button
              title="4"
              onPress={() => handleNumberPress(4)}
            />
            <Button
              title="5"
              onPress={() => handleNumberPress(5)}
            />
            <Button
              title="6"
              onPress={() => handleNumberPress(6)}
            />
            <Button
              title="+"
              onPress={() => handleOperation('+')}
              style={styles.operationButton}
            />
          </View>

          <View style={styles.row}>
            <Button
              title="1"
              onPress={() => handleNumberPress(1)}
            />
            <Button
              title="2"
              onPress={() => handleNumberPress(2)}
            />
            <Button
              title="3"
              onPress={() => handleNumberPress(3)}
            />
            <Button
              title="="
              onPress={handleEquals}
              style={styles.equalsButton}
            />
          </View>

          <View style={styles.row}>
            <Button
              title="0"
              onPress={() => handleNumberPress(0)}
              style={styles.zeroButton}
            />
            <Button
              title="."
              onPress={handleDecimal}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  calculator: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 24,
  },
  display: {
    fontSize: 72,
    color: '#fff',
    fontWeight: '700',
  },
  expression: {
    fontSize: 18,
    color: '#bfbfbf',
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
  liveResult: {
    fontSize: 22,
    color: '#bfbfbf',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  buttonsContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 70,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '500',
  },
  functionButton: {
    backgroundColor: '#666',
  },
  operationButton: {
    backgroundColor: '#ff9500',
  },
  equalsButton: {
    backgroundColor: '#4CAF50',
  },
  zeroButton: {
    flex: 2,
  },
});
