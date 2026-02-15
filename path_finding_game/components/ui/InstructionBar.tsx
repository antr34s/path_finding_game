import { Text, View, StyleSheet } from 'react-native';

interface Props {
  message: string;
}

export default function InstructionBar({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0b1020',
    borderWidth: 1,
    borderColor: '#00ffcc55',
    marginBottom: 10,
  },
  text: {
    color: '#00ffcc',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: '#00ffcc',
    textShadowRadius: 6,
  },
});