import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const STEPS = [
  {
    color: '#00ffd5',
    number: '1',
    title: 'Place Start Node',
    desc: 'Click any empty cell to set your starting point.',
  },
  {
    color: '#ff006e',
    number: '2',
    title: 'Place Destination',
    desc: 'Click another cell to mark where you want to arrive.',
  },
  {
    color: '#e6e6e6',
    number: '3',
    title: 'Draw Obstacles',
    desc: 'Click and drag to build walls the algorithm must navigate around. You can change the cost of the wall in the controls.',
  },
  {
    color: '#00ffcc',
    number: '4',
    title: 'Choose & Run',
    desc: 'Pick an algorithm from A*, Dijkstra, BFS, or DFS and then press Play!',
  },
];

export default function OnboardingGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
  };



  return (
    <>
    <Pressable style={styles.infoButton} onPress={() => setVisible(true)}>
        <Text style={styles.infoText}>i</Text>
    </Pressable>
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
            } as any,
          ]}
        >
          <Text selectable={false} style={styles.title}>ALGOGRAPH</Text>
          <Text selectable={false} style={styles.subtitle}>
            Path Finding Algorithm Visualizer
          </Text>

          <View style={styles.steps}>
            {STEPS.map((step) => (
              <View
                key={step.number}
                style={[styles.stepCard, { borderLeftColor: step.color }]}
              >
                <View style={[styles.stepBadge, { backgroundColor: step.color }]}>
                  <Text selectable={false} style={styles.stepNumber}>{step.number}</Text>
                </View>
                <View style={styles.stepText}>
                  <Text selectable={false} style={styles.stepTitle}>{step.title}</Text>
                  <Text selectable={false} style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable style={styles.button} onPress={dismiss}>
            <Text selectable={false} style={styles.buttonText}>Let's Go!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
    infoButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#00ffcc',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  infoText: {
    color: '#05010a',
    fontSize: 24,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 360,
    backgroundColor: 'rgba(5, 1, 10, 0.88)',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 204, 0.35)',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#00ffcc',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: '#00ffcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#88fff0',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 24,
  },
  steps: {
    gap: 10,
    marginBottom: 24,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 255, 204, 0.04)',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    gap: 12,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: '#aaa',
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
  },
});