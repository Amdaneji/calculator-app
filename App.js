import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [expression, setExpression] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isDegrees, setIsDegrees] = useState(true);
  const [isShift, setIsShift] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState('scientific');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const inputRef = useRef(null);

  const STORAGE_KEYS = {
    THEME: 'calculator_theme',
    MODE: 'calculator_mode',
  };

  // Load persisted settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const themeValue = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        const modeValue = await AsyncStorage.getItem(STORAGE_KEYS.MODE);
        if (themeValue !== null) setIsDarkTheme(themeValue === 'dark');
        if (modeValue !== null) setCalculatorMode(modeValue);
      } catch (e) {
        // ignore load errors
      }
    };
    loadSettings();
  }, []);

  // Persist theme and mode whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.THEME, isDarkTheme ? 'dark' : 'light');
        await AsyncStorage.setItem(STORAGE_KEYS.MODE, calculatorMode);
      } catch (e) {
        // ignore save errors
      }
    };
    saveSettings();
  }, [isDarkTheme, calculatorMode]);

  // Sync cursor position to TextInput
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setNativeProps({
        selection: { start: cursorPos, end: cursorPos }
      });
    }
  }, [cursorPos]);

  // Append to expression at cursor position
  const appendToExpression = (value) => {
    const newExpr = expression.slice(0, cursorPos) + value + expression.slice(cursorPos);
    setExpression(newExpr);
    setCursorPos(cursorPos + value.length);
  };



  // Clear everything
  const handleClear = () => {
    setExpression('');
    setCursorPos(0);
    setLastResult(null);
    setIsShift(false);
  };

  // Backspace
  const handleBackspace = () => {
    if (cursorPos > 0) {
      const newExpr = expression.slice(0, cursorPos - 1) + expression.slice(cursorPos);
      setExpression(newExpr);
      setCursorPos(cursorPos - 1);
    }
  };

  // Evaluate expression
  const evaluateExpression = (expr) => {
    try {
      if (!expr || expr.trim() === '') return null;

      // Auto-close unclosed parentheses for live preview
      let openCount = (expr.match(/\(/g) || []).length;
      let closeCount = (expr.match(/\)/g) || []).length;
      let autoClosedExpr = expr + ')'.repeat(Math.max(0, openCount - closeCount));

      // Replace scientific function names with Math equivalents
      let evalExpr = autoClosedExpr
        .replace(/π/g, Math.PI)
        .replace(/e(?![a-zA-Z])/g, Math.E)
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/asin\(/g, 'Math.asin(')
        .replace(/acos\(/g, 'Math.acos(')
        .replace(/atan\(/g, 'Math.atan(')
        .replace(/sinh\(/g, 'Math.sinh(')
        .replace(/cosh\(/g, 'Math.cosh(')
        .replace(/tanh\(/g, 'Math.tanh(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');

      // Add implicit multiplication between number and Math function
      evalExpr = evalExpr.replace(/(\d)Math\./g, '$1*Math.');

      // Add implicit multiplication between ) and number or (
      evalExpr = evalExpr.replace(/\)(\d|\()/g, ')*$1');

      // Add implicit multiplication between ) and Math.
      evalExpr = evalExpr.replace(/\)Math\./g, ')*Math.');

      // Handle factorial
      evalExpr = evalExpr.replace(/(\d+)!/g, (match, num) => {
        const n = parseInt(num);
        if (n < 0) return 'NaN';
        if (n === 0 || n === 1) return '1';
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
      });

      // Handle degree to radian conversion for trig functions if needed
      if (isDegrees) {
        // Pre-process: convert sin/cos/tan arguments from degrees to radians
        evalExpr = evalExpr.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (match, func, arg) => {
          return `Math.${func}(${arg}*Math.PI/180)`;
        });
      }

      const result = Function('"use strict"; return (' + evalExpr + ')')();

      if (!isFinite(result) || isNaN(result)) return null;
      return result;
    } catch (e) {
      return null;
    }
  };

  const handleEquals = () => {
    const result = evaluateExpression(expression);
    if (result !== null) {
      setLastResult(result);
      const resultStr = formatResult(result);
      setExpression(resultStr);
      setCursorPos(resultStr.length);
    }
  };

  const formatResult = (value) => {
    if (value === null || value === undefined) return '';
    if (!isFinite(value) || isNaN(value)) return 'Error';
    return Number.isInteger(value)
      ? String(value)
      : String(parseFloat(value.toFixed(8)).toString());
  };

  const previewResult = evaluateExpression(expression);
  const previewText = previewResult !== null ? formatResult(previewResult) : '';

  const theme = isDarkTheme
    ? {
      background: '#1a1a1a',
      displayBackground: '#0a0a0a',
      panelBackground: '#222222',
      calculatorBackground: '#1a1a1a',
      text: '#ffffff',
      secondaryText: '#999999',
      border: '#333333',
      modalBackground: '#262626',
      modalMuted: '#333333',
      numberButtonBg: '#444444',
      trigoButtonBg: '#3a4a3a',
      functionButtonBg: '#555555',
      operationButtonBg: '#ff9500',
      equalsButtonBg: '#4CAF50',
    }
    : {
      background: '#eef2f7',
      displayBackground: '#ffffff',
      panelBackground: '#d8dee8',
      calculatorBackground: '#eef2f7',
      text: '#111111',
      secondaryText: '#5b6472',
      border: '#c7cfdb',
      modalBackground: '#ffffff',
      modalMuted: '#edf1f6',
      numberButtonBg: '#c7cfdb',
      trigoButtonBg: '#b8c5d6',
      functionButtonBg: '#aebccf',
      operationButtonBg: '#ff9500',
      equalsButtonBg: '#4CAF50',
    };

  const aboutText =
    'Amdaneji Calculator is an expression-based calculator. Basic mode keeps the core keypad, while scientific mode adds trig, logs, powers, factorial, constants, and SHIFT functions.';

  const Button = ({ onPress, title, style, buttonType = 'default' }) => {
    const getButtonBg = () => {
      if (buttonType === 'number') return theme.numberButtonBg;
      if (buttonType === 'trigo') return theme.trigoButtonBg;
      if (buttonType === 'function') return theme.functionButtonBg;
      if (buttonType === 'operation') return theme.operationButtonBg;
      if (buttonType === 'equals') return theme.equalsButtonBg;
      return theme.modalMuted;
    };
    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getButtonBg() }, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const DualButton = ({ primary, secondary, onPress, style, buttonType = 'default' }) => {
    const getButtonBg = () => {
      if (buttonType === 'number') return theme.numberButtonBg;
      if (buttonType === 'trigo') return theme.trigoButtonBg;
      if (buttonType === 'function') return theme.functionButtonBg;
      if (buttonType === 'operation') return theme.operationButtonBg;
      if (buttonType === 'equals') return theme.equalsButtonBg;
      return theme.modalMuted;
    };
    return (
      <TouchableOpacity
        style={[styles.dualButton, { backgroundColor: getButtonBg() }, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {secondary && isShift && (
          <Text style={styles.secondaryLabel}>{secondary}</Text>
        )}
        <Text style={[styles.dualButtonText, { color: theme.text }]}>{primary}</Text>
      </TouchableOpacity>
    );
  };

  const insertLastResult = () => {
    let result = lastResult;
    if (result === null && expression) {
      result = evaluateExpression(expression);
    }
    if (result !== null) {
      setExpression(String(result));
      setCursorPos(String(result).length);
    }
  };

  const renderScientificKeypad = () => (
    <View style={styles.calculator}>
      <View style={styles.row}>
        <Button title="C" onPress={handleClear} buttonType="function" />
        <Button title="DEL" onPress={handleBackspace} buttonType="function" />
        <Button title="(" onPress={() => appendToExpression('(')} buttonType="function" />
        <Button title=")" onPress={() => appendToExpression(')')} buttonType="function" />
        <Button title="÷" onPress={() => appendToExpression('÷')} buttonType="operation" />
        <Button title="×" onPress={() => appendToExpression('×')} buttonType="operation" />
        <Button title="−" onPress={() => appendToExpression('−')} buttonType="operation" />
      </View>

      <View style={styles.row}>
        <DualButton
          primary="sin("
          secondary="asin("
          onPress={() => {
            const func = isShift ? 'asin(' : 'sin(';
            appendToExpression(func);
            if (isShift) setIsShift(false);
          }}
          buttonType="trigo"
        />
        <DualButton
          primary="cos("
          secondary="acos("
          onPress={() => {
            const func = isShift ? 'acos(' : 'cos(';
            appendToExpression(func);
            if (isShift) setIsShift(false);
          }}
          buttonType="trigo"
        />
        <DualButton
          primary="tan("
          secondary="atan("
          onPress={() => {
            const func = isShift ? 'atan(' : 'tan(';
            appendToExpression(func);
            if (isShift) setIsShift(false);
          }}
          buttonType="trigo"
        />
        <DualButton
          primary="log("
          secondary="10^x"
          onPress={() => {
            if (isShift) {
              appendToExpression('10^');
              setIsShift(false);
            } else {
              appendToExpression('log(');
            }
          }}
          buttonType="trigo"
        />
        <DualButton
          primary="ln("
          secondary="e^x"
          onPress={() => {
            if (isShift) {
              appendToExpression('e^');
              setIsShift(false);
            } else {
              appendToExpression('ln(');
            }
          }}
          buttonType="trigo"
        />
        <DualButton
          primary="√("
          secondary="x²"
          onPress={() => {
            if (isShift) {
              appendToExpression('^2');
              setIsShift(false);
            } else {
              appendToExpression('sqrt(');
            }
          }}
          buttonType="trigo"
        />
        <Button title="+" onPress={() => appendToExpression('+')} buttonType="operation" />
      </View>

      <View style={styles.row}>
        <DualButton
          primary="7"
          secondary="sinh("
          onPress={() => {
            if (isShift) {
              appendToExpression('sinh(');
              setIsShift(false);
            } else {
              appendToExpression('7');
            }
          }}
          buttonType="number"
        />
        <DualButton
          primary="8"
          secondary="cosh("
          onPress={() => {
            if (isShift) {
              appendToExpression('cosh(');
              setIsShift(false);
            } else {
              appendToExpression('8');
            }
          }}
          buttonType="number"
        />
        <DualButton
          primary="9"
          secondary="tanh("
          onPress={() => {
            if (isShift) {
              appendToExpression('tanh(');
              setIsShift(false);
            } else {
              appendToExpression('9');
            }
          }}
          buttonType="number"
        />
        <DualButton
          primary="x³"
          secondary="^"
          onPress={() => {
            if (isShift) {
              appendToExpression('^');
              setIsShift(false);
            } else {
              appendToExpression('^3');
            }
          }}
          buttonType="trigo"
        />
        <Button title="1/x" onPress={() => appendToExpression('1/()')} buttonType="trigo" />
        <Button title="!" onPress={() => appendToExpression('!')} buttonType="trigo" />
        <Button title="=" onPress={handleEquals} buttonType="equals" />
      </View>

      <View style={styles.row}>
        <Button title="4" onPress={() => appendToExpression('4')} buttonType="number" />
        <Button title="5" onPress={() => appendToExpression('5')} buttonType="number" />
        <Button title="6" onPress={() => appendToExpression('6')} buttonType="number" />
        <Button title="π" onPress={() => appendToExpression('π')} buttonType="trigo" />
        <Button title="e" onPress={() => appendToExpression('e')} buttonType="trigo" />
        <DualButton
          primary="+/-"
          secondary="|x|"
          onPress={() => {
            if (isShift) {
              appendToExpression('abs(');
              setIsShift(false);
            } else {
              appendToExpression('-');
            }
          }}
          buttonType="trigo"
        />
        <Button title="." onPress={() => appendToExpression('.')} buttonType="number" />
      </View>

      <View style={styles.row}>
        <Button title="1" onPress={() => appendToExpression('1')} buttonType="number" />
        <Button title="2" onPress={() => appendToExpression('2')} buttonType="number" />
        <Button title="3" onPress={() => appendToExpression('3')} buttonType="number" />
        <Button title="0" onPress={() => appendToExpression('0')} buttonType="number" style={styles.zeroButton} />
        <Button title="00" onPress={() => appendToExpression('00')} buttonType="number" style={{ flex: 1.2 }} />
        <Button title="Ans" onPress={insertLastResult} buttonType="trigo" />
      </View>
    </View>
  );

  const renderBasicKeypad = () => (
    <View style={styles.calculator}>
      <View style={styles.row}>
        <Button title="C" onPress={handleClear} buttonType="function" />
        <Button title="DEL" onPress={handleBackspace} buttonType="function" />
        <Button title="(" onPress={() => appendToExpression('(')} buttonType="function" />
        <Button title=")" onPress={() => appendToExpression(')')} buttonType="function" />
        <Button title="÷" onPress={() => appendToExpression('÷')} buttonType="operation" />
        <Button title="×" onPress={() => appendToExpression('×')} buttonType="operation" />
      </View>
      <View style={styles.row}>
        <Button title="7" onPress={() => appendToExpression('7')} buttonType="number" />
        <Button title="8" onPress={() => appendToExpression('8')} buttonType="number" />
        <Button title="9" onPress={() => appendToExpression('9')} buttonType="number" />
        <Button title="+" onPress={() => appendToExpression('+')} buttonType="operation" />
      </View>
      <View style={styles.row}>
        <Button title="4" onPress={() => appendToExpression('4')} buttonType="number" />
        <Button title="5" onPress={() => appendToExpression('5')} buttonType="number" />
        <Button title="6" onPress={() => appendToExpression('6')} buttonType="number" />
        <Button title="−" onPress={() => appendToExpression('−')} buttonType="operation" />
      </View>
      <View style={styles.row}>
        <Button title="1" onPress={() => appendToExpression('1')} buttonType="number" />
        <Button title="2" onPress={() => appendToExpression('2')} buttonType="number" />
        <Button title="3" onPress={() => appendToExpression('3')} buttonType="number" />
        <Button title="." onPress={() => appendToExpression('.')} buttonType="number" />
      </View>
      <View style={styles.row}>
        <Button title="0" onPress={() => appendToExpression('0')} buttonType="number" style={styles.zeroButton} />
        <Button title="00" onPress={() => appendToExpression('00')} buttonType="number" style={{ flex: 1.2 }} />
        <Button title="Ans" onPress={insertLastResult} buttonType="trigo" />
        <Button title="=" onPress={handleEquals} buttonType="equals" />
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />

        <View style={[styles.displayContainer, { backgroundColor: theme.displayBackground, borderBottomColor: theme.border }]}>
          <TextInput
            ref={inputRef}
            style={[styles.display, { color: theme.text }]}
            value={expression || '0'}
            onChangeText={(text) => {
              setExpression(expression);
            }}
            onSelectionChange={(e) => {
              setCursorPos(e.nativeEvent.selection.start);
            }}
            editable={true}
            showSoftInputOnFocus={false}
            selectTextOnFocus={false}
            numberOfLines={1}
            maxLength={200}
            caretHidden={false}
          />
          {previewText ? (
            <Text style={[styles.liveResult, { color: theme.secondaryText }]} numberOfLines={1} ellipsizeMode="tail">
              {previewText}
            </Text>
          ) : null}
        </View>

        <View style={[styles.controlPanel, { backgroundColor: theme.panelBackground, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.modeButton, calculatorMode === 'scientific' && styles.modeButtonActive]}
            onPress={() => setCalculatorMode(calculatorMode === 'scientific' ? 'basic' : 'scientific')}
          >
            <Text style={[styles.modeButtonText, { color: theme.text }]}>
              {calculatorMode === 'scientific' ? 'SCIENTIFIC' : 'BASIC'}
            </Text>
          </TouchableOpacity>

          {calculatorMode === 'scientific' ? (
            <>
              <TouchableOpacity
                style={[styles.shiftButton, isShift && styles.shiftActive]}
                onPress={() => setIsShift(!isShift)}
              >
                <Text style={[styles.shiftText, isShift && styles.shiftTextActive]}>
                  {isShift ? 'SHIFT ON' : 'SHIFT'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.degRadButton, isDegrees ? styles.degRadActive : null]}
                onPress={() => setIsDegrees(!isDegrees)}
              >
                <Text style={styles.degRadText}>{isDegrees ? 'DEG' : 'RAD'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.controlSpacer} />
          )}

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Text style={[styles.settingsIcon, { color: theme.text }]}>⚙</Text>
          </TouchableOpacity>
        </View>

        {calculatorMode === 'scientific' ? renderScientificKeypad() : renderBasicKeypad()}

        <Modal
          transparent
          visible={settingsVisible}
          animationType="fade"
          onRequestClose={() => setSettingsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.modalBackground, borderColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Settings</Text>

              <TouchableOpacity
                style={[styles.themeToggle, { backgroundColor: theme.modalMuted, borderColor: theme.border }]}
                onPress={() => setIsDarkTheme(!isDarkTheme)}
              >
                <Text style={[styles.themeToggleText, { color: theme.text }]}>Theme</Text>
                <Text style={[styles.themeToggleValue, { color: theme.secondaryText }]}>
                  {isDarkTheme ? 'Dark' : 'Light'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.aboutHeader, { backgroundColor: theme.modalMuted, borderColor: theme.border }]}
                onPress={() => setAboutExpanded(!aboutExpanded)}
              >
                <Text style={[styles.aboutLabel, { color: theme.text }]}>About</Text>
                <Text style={[styles.aboutArrow, { color: theme.text }]}>
                  {aboutExpanded ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>

              {aboutExpanded && (
                <Text style={[styles.aboutText, { color: theme.secondaryText }]}>{aboutText}</Text>
              )}

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.modalMuted, borderColor: theme.border }]}
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: theme.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  displayContainer: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    minHeight: 160,
  },
  display: {
    fontSize: 56,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'right',
    padding: 0,
    minHeight: 70,
  },
  cursor: {
    fontSize: 48,
    color: '#ff9500',
    fontWeight: '700',
  },
  liveResult: {
    fontSize: 20,
    color: '#999',
    textAlign: 'right',
    marginTop: 10,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  controlSpacer: {
    flex: 1,
  },
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  modeButtonActive: {
    backgroundColor: '#4a5cff',
    borderColor: '#4a5cff',
  },
  modeButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  settingsButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  settingsIcon: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
  },
  shiftButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  shiftActive: {
    backgroundColor: '#ff9500',
    borderColor: '#ff9500',
  },
  shiftText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  shiftTextActive: {
    color: '#fff',
  },
  degRadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#555',
  },
  degRadActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  degRadText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  calculator: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 3,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 65,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  dualButton: {
    flex: 1,
    height: 65,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dualButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  secondaryLabel: {
    position: 'absolute',
    top: 2,
    fontSize: 8,
    color: '#ff9500',
    fontWeight: '700',
  },
  zeroButton: {
    flex: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeToggleValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  aboutArrow: {
    fontSize: 12,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  closeButton: {
    marginTop: 18,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
