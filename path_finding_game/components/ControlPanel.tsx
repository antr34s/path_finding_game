import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';

interface Props {
  algorithm: string;
  setAlgorithm: (algo: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  allowDiagonal: boolean;
  setAllowDiagonal: (value: boolean) => void;
  isSmallScreen: boolean;
}

const ALGORITHMS = ['A*', 'Dijkstra', 'BFS', 'DFS'];

export default function ControlPanel({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  allowDiagonal,
  setAllowDiagonal,
  isSmallScreen,
}: Props) {
  return (
    <View
        style={[
            styles.panel,
            isSmallScreen && styles.panelMobile,
        ]}
    >
        {/* Algorithms row */}
        <View style={styles.algorithmsRow}>
            {ALGORITHMS.map(algo => (
            <Pressable
                key={algo}
                onPress={() => setAlgorithm(algo)}
                style={[
                styles.button,
                algorithm === algo && styles.buttonActive,
                ]}
            >
                <Text style={styles.buttonText}>{algo}</Text>
            </Pressable>
            ))}
        </View>

        {/* Controls row */}
        <View
            style={[
            styles.controlsRow,
            isSmallScreen && styles.controlsRowMobile,
            ]}
        >
            {/* Speed */}
            <View style={styles.controlItem}>
            <Text style={styles.label}>Speed</Text>
            <Slider
                minimumValue={1}
                maximumValue={100}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#00ffcc"
                maximumTrackTintColor="#222"
                thumbTintColor="#00ffcc"
            />
            </View>

            {/* Diagonal */}
            <Pressable
            onPress={() => setAllowDiagonal(!allowDiagonal)}
            style={[
                styles.toggle,
                allowDiagonal && styles.toggleActive,
            ]}
            >
            <Text style={styles.buttonText}>
                Diagonal {allowDiagonal ? 'ON' : 'OFF'}
            </Text>
            </Pressable>

            {/* Play */}
            <Pressable style={styles.playButton}>
            <Text style={styles.playText}>PLAY</Text>
            </Pressable>

            {/* Reset */}
            <Pressable style={styles.resetButton}>
            <Text style={styles.buttonText}>RESET</Text>
            </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    algorithmsRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },

    controlsRow: {
        marginTop: 12,
        flexDirection: 'column',
        gap: 10,
    },

    controlsRowMobile: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    controlItem: {
        minWidth: 120,
    },

    label: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 4,
    },
    panel: {
        width: 220,
        padding: 8,
        backgroundColor: '#05010a',
        borderLeftWidth: 2,
        borderColor: '#00ffcc',
    },

    panelMobile: {
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderLeftWidth: 0,
        flexDirection: 'column',
    },
    title: {
        color: '#00ffcc',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    button: {
        padding: 8,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#00ffcc',
        borderRadius: 6,
    },
    buttonActive: {
        backgroundColor: '#00ffcc',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    toggle: {
        marginTop: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#00ffcc',
        borderRadius: 6,
    },
    toggleActive: {
        backgroundColor: '#00ffcc',
    },
    playButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#00ffcc',
        borderRadius: 6,
    },
    playText: {
        color: '#05010a',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    resetButton: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ff0055',
        borderRadius: 6,
    },
});