import { Text, View, StyleSheet } from 'react-native';

export default function Title() {
  return (
    <View style={styles.container}>
      <Text style={styles.glow}>PATHFINDER</Text>
      <Text style={styles.sub}>Algorithm Visualizer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 12,
  },
  glow: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00ffcc',
    textShadowColor: '#00ffcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 3,
  },
  sub: {
    fontSize: 12,
    color: '#88fff0',
    opacity: 0.8,
    marginTop: 4,
  },
});