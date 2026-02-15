import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Grid from '../components/grid/Grid';
import ControlPanel from '../components/ui/ControlPanel';
import InstructionBar from '../components/ui/InstructionBar';
import StatsModal from '../components/ui/StatsModal';
import Title from '../components/ui/Title';
import { useGrid } from '../hooks/useGrid';
import { usePathfinding } from '../hooks/usePathfinding';
import { GRID_SIZE } from '../utils/createGrid';

export default function HomeScreen() {
  const [algorithm, setAlgorithm] = useState('A*');
  const [speed, setSpeed] = useState(50);
  const [selectedWeight, setSelectedWeight] = useState(Infinity);
  const [allowDiagonal, setAllowDiagonal] = useState(false);

  const {
    grid, setGrid, startSet, endSet,
    isPressing, setIsPressing,
    handleCellPress, resetGrid, resetPath, buildRequest,
  } = useGrid(algorithm, allowDiagonal, selectedWeight);

  const {
    isRunning, runCompleted, instruction,
    stats, showStats, setShowStats,
    handleRunOrReset, reset,
  } = usePathfinding({ grid, setGrid, speed, algorithm, startSet, endSet, buildRequest });

  const { width, height } = useWindowDimensions();
  const CELL_BORDER = 0.5;
  const GRID_PADDING = 10;
  const HEADER_HEIGHT = 120;
  const CONTROL_PANEL_WIDTH = 220;
  const CONTROL_PANEL_HEIGHT = 120;
  const isSmallScreen = width < 768;

  const availableWidth = isSmallScreen
    ? width - GRID_PADDING * 2 - 20
    : width - CONTROL_PANEL_WIDTH - GRID_PADDING * 2;

  const availableHeight = isSmallScreen
    ? height - HEADER_HEIGHT - CONTROL_PANEL_HEIGHT - GRID_PADDING * 2 - 20
    : height - HEADER_HEIGHT - GRID_PADDING * 2;

  const cellSize = Math.floor(
    Math.min(
      availableWidth / GRID_SIZE - CELL_BORDER * 2,
      availableHeight / GRID_SIZE - CELL_BORDER * 2
    )
  );

  const onClear = () => {
    reset();
    resetGrid();
  };

  const onPlay = () => handleRunOrReset(resetPath);

  const controlPanelProps = {
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    allowDiagonal,
    setAllowDiagonal,
    isSmallScreen,
    isRunning,
    runCompleted,
    onClear,
    onPlay,
    selectedWeight,
    setSelectedWeight,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          !isSmallScreen && { paddingRight: CONTROL_PANEL_WIDTH },
        ]}
      >
        <Title />
        <InstructionBar message={instruction} />
      </View>
      <View
        style={[
          styles.content,
          { flexDirection: isSmallScreen ? 'column' : 'row' },
        ]}
      >
        {isSmallScreen && <ControlPanel {...controlPanelProps} />}
        <View style={styles.gridContainer}>
          <ScrollView horizontal>
            <ScrollView>
              <Grid
                grid={grid}
                cellSize={cellSize}
                onCellPress={(cell) => handleCellPress(cell, isRunning)}
                onPressIn={() => setIsPressing(true)}
                onPressOut={() => setIsPressing(false)}
                isPressing={isPressing}
                isRunning={isRunning}
                selectedWeight={selectedWeight}
              />
            </ScrollView>
          </ScrollView>
        </View>
        {!isSmallScreen && <ControlPanel {...controlPanelProps} />}
      </View>
      <StatsModal
        visible={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        isSmallScreen={isSmallScreen}
        controlPanelWidth={CONTROL_PANEL_WIDTH}
      />
      <View style={styles.footer}>
        <Text selectable={false} style={styles.footerText}>
          &copy; 2026 Antreas Panagi & Michael Panaetov
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 8,
    left: 12,
  },
  footerText: {
    color: '#00ffcc',
    fontSize: 12,
    opacity: 0.7,
    textShadowColor: '#00ffcc',
    textShadowRadius: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#05010a',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  gridContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
