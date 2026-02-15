import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState } from 'react';

interface Props {
  algorithm: string;
  setAlgorithm: (algo: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  allowDiagonal: boolean;
  setAllowDiagonal: (value: boolean) => void;
  isSmallScreen: boolean;
  isRunning: boolean;
  runCompleted: boolean;
  onPlay: () => void;
  onClear: () => void;
  selectedWeight: number;
  setSelectedWeight: (w: number)=> void;
}

type AlgorithmType = 'A*' | 'DIJKSTRA' | 'BFS' | 'DFS';

const ALGORITHMS: AlgorithmType[] = ['A*', 'DIJKSTRA', 'BFS', 'DFS'];

export default function ControlPanel({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  allowDiagonal,
  setAllowDiagonal,
  isSmallScreen,
  isRunning,
  runCompleted,
  onPlay,
  onClear,
  selectedWeight,
  setSelectedWeight,
}: Props) {
    const [hoveredAlgo, setHoveredAlgo] = useState<string | null>(null);
    const [hoverDiagonal, setHoverDiagonal] = useState(false);
    const MIN_WEIGHT = 2;
    const MAX_WEIGHT = 9;

    const changeWeight = (direction: 1 | -1) => {
    if (selectedWeight === Infinity) {
        setSelectedWeight(direction === 1 ? MIN_WEIGHT : MAX_WEIGHT);
        return;
    }

    const newWeight = selectedWeight + direction;

    if (newWeight > MAX_WEIGHT || newWeight < MIN_WEIGHT) {
        setSelectedWeight(Infinity);
        return;
    }

    setSelectedWeight(newWeight);
    };
    const algoInfo: Record<string, string> = {
        'A*':
            'A* is a smart search algorithm. It tries to guess which direction is closer to the goal and it finds the shortest path faster.',
        
        'DIJKSTRA':
            'Dijkstra checks all possible paths step by step and guarantees the shortest path, but it can be slower than A*.',
        
        'BFS':
            'BFS explores the grid evenly in all directions. It finds the shortest path only when all obstacles have the same cost.',
        
        'DFS':
            'DFS goes as far as possible in one direction before turning back. It does not guarantee the shortest path.',
    };
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
                onHoverIn={() => setHoveredAlgo(algo)}
                onHoverOut={() => setHoveredAlgo(null)}
                style={[
                styles.button,
                algorithm === algo && styles.buttonActive,
                ]}
            >
                <Text selectable={false} style={styles.buttonText}>{algo}</Text>
                {hoveredAlgo === algo && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>
                        {algoInfo[algo]}
                        </Text>
                    </View>
                )}
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
            <Text selectable={false} style={styles.label}>Speed</Text>
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
                onHoverIn={() => setHoverDiagonal(true)}
                onHoverOut={() => setHoverDiagonal(false)}
                style={[
                    styles.toggle,
                    allowDiagonal && styles.toggleActive,
                ]}
                >
                <Text selectable={false} style={styles.buttonText}>
                    Diagonal {allowDiagonal ? 'ON' : 'OFF'}
                </Text>
                {hoverDiagonal && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>
                        Allow the algorithm to move diagonally, not only up, down, left, or right.
                        </Text>
                    </View>
                )}
            </Pressable>

            {/* Play */}
            <Pressable
                onPress={onPlay}
                disabled={isRunning}
                style={[
                    styles.playButton,
                    isRunning && { opacity: 0.5 },
                ]}
                >
                <Text selectable={false} style={styles.playText}>
                    {isRunning
                        ? 'RUNNING...'
                        : runCompleted
                            ? 'RESET'
                            : 'PLAY'
                    }
                </Text>
            </Pressable>

            {/* Reset */}
            <Pressable
                onPress={onClear}
                disabled={isRunning}
                style={[
                    styles.resetButton,
                    isRunning && { opacity: 0.5 },
                ]}
                >
                <Text selectable={false} style={styles.buttonText}>
                    {'CLEAR'}
                </Text>
            </Pressable>
            <View style={styles.weightWrapper}>
                <Text selectable={false} style={styles.label}>
                    Obstacle Cost
                </Text>

                <View style={styles.weightControl}>
                    <Pressable style={styles.weightButton} onPress={() => changeWeight(-1)}>
                    <Text selectable={false} style={styles.weightText}>−</Text>
                    </Pressable>

                    <Text selectable={false} style={styles.weightDisplay}>
                    {selectedWeight === Infinity ? '∞' : selectedWeight}
                    </Text>

                    <Pressable style={styles.weightButton} onPress={() => changeWeight(1)}>
                    <Text selectable={false} style={styles.weightText}>+</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        right: '100%',
        marginRight: 8,
        top: '50%',
        transform: [{ translateY: -20 }],
        backgroundColor: '#111',
        padding: 8,
        borderRadius: 6,
        width: 170,
        borderWidth: 1,
        borderColor: '#00ffcc',
        zIndex: 999,
    },
    tooltipText: {
        color: '#00ffcc',
        fontSize: 10,
    },
    weightWrapper: {
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    weightControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        
    },
    weightButton: {
        borderWidth: 1,
        borderColor: '#00ffcc',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    weightText: {
        color: '#00ffcc',
        fontSize: 18,
    },
    weightDisplay: {
        color: '#00ffcc',
        fontSize: 18,
        textShadowColor: '#00ffcc',
        textShadowRadius: 6,
    },
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
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: 10,
    },

    controlItem: {
        minWidth: 80,
    },

    label: {
        color: '#00ffcc',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        textShadowColor: '#00ffcc',
        textShadowRadius: 4,
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
        padding: 6,
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
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 10,
        minHeight: 48,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00ffcc',
        borderRadius: 6,
    },
    toggleActive: {
        backgroundColor: '#00ffcc',
    },
    playButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 10,
        minHeight: 48,
        justifyContent: 'center',
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
        paddingVertical: 12,
        paddingHorizontal: 10,
        minHeight: 48,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ff0055',
        borderRadius: 6,
    },
});