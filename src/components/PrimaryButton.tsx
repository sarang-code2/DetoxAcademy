import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  style?: ViewStyle;
};

const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  testID,
  accessibilityLabel,
  disabled,
  loading,
  variant = 'primary',
  style,
}) => {
  const { theme } = useAppTheme();
  const bg =
    variant === 'danger' ? theme.danger : variant === 'secondary' ? theme.card : theme.primary;
  const fg = variant === 'secondary' ? theme.text : '#FFFFFF';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        { backgroundColor: bg, opacity: isDisabled ? 0.5 : 1 },
        variant === 'secondary' && { borderWidth: 1, borderColor: theme.border },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator testID={testID ? `${testID}-spinner` : undefined} color={fg} />
      ) : (
        <Text style={[styles.label, { color: fg }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: { fontSize: 16, fontWeight: '600' },
});

export default PrimaryButton;
