import { View, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { createGrid } from '../utils/createGrid';
import { Cell, CellType } from '../types/grid';
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';
import { useWindowDimensions } from 'react-native';
import { GRID_SIZE } from '../utils/createGrid';

export default function HomeScreen() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startSet, setStartSet] = useState(false);
  const [endSet, setEndSet] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [algorithm, setAlgorithm] = useState('A*');
  const [speed, setSpeed] = useState(50);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const { width, height } = useWindowDimensions();
  const CELL_BORDER = 0.5;
  const GRID_PADDING = 10;
  const CONTROL_PANEL_WIDTH = 220;
  const CONTROL_PANEL_HEIGHT = 120;
  const isSmallScreen = width < 768;

  const availableWidth = isSmallScreen
    ? width - GRID_PADDING * 2
    : width - CONTROL_PANEL_WIDTH - GRID_PADDING * 2;

  const availableHeight = isSmallScreen
    ? height - CONTROL_PANEL_HEIGHT - GRID_PADDING * 2
    : height - GRID_PADDING * 2;

  const cellSizeFromWidth =
  availableWidth / GRID_SIZE - CELL_BORDER * 2;

const cellSizeFromHeight =
  availableHeight / GRID_SIZE - CELL_BORDER * 2;

const cellSize = Math.floor(
    Math.min(cellSizeFromWidth, cellSizeFromHeight)
);

  useEffect(() => {
    setGrid(createGrid());
  }, []);

  const updateCell = (cell: Cell, newType: CellType) => {
    setGrid(prev =>
      prev.map(row =>
        row.map(c =>
          c.row === cell.row && c.col === cell.col
            ? { ...c, type: newType }
            : c
        )
      )
    );
  };

  const handleCellPress = (cell: Cell) => {
    if (!startSet) {
      updateCell(cell, 'start');
      setStartSet(true);
      return;
    }

    if (!endSet) {
      updateCell(cell, 'end');
      setEndSet(true);
      return;
    }

    
    if (cell.type === 'empty') {
      updateCell(cell, 'obstacle');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          { flexDirection: isSmallScreen ? 'column' : 'row' },
        ]}
      >
        {isSmallScreen && (
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            speed={speed}
            setSpeed={setSpeed}
            allowDiagonal={allowDiagonal}
            setAllowDiagonal={setAllowDiagonal}
            isSmallScreen={isSmallScreen}
          />
        )}
        <View style={styles.gridContainer}>
          <ScrollView horizontal>
            <ScrollView>
              <Grid
                grid={grid}
                cellSize={cellSize}
                onCellPress={handleCellPress}
                onPressIn={() => setIsPressing(true)}
                onPressOut={() => setIsPressing(false)}
                isPressing={isPressing}
              />
            </ScrollView>
          </ScrollView>
        </View>
        

        {!isSmallScreen && (
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            speed={speed}
            setSpeed={setSpeed}
            allowDiagonal={allowDiagonal}
            setAllowDiagonal={setAllowDiagonal}
            isSmallScreen={isSmallScreen}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05010a',
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
