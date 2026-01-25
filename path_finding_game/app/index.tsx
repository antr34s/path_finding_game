import Title from '../components/Title';
import InstructionBar from '../components/InstructionBar';
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
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState('A*');
  const [speed, setSpeed] = useState(50);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const [runCompleted, setRunCompleted] = useState(false);
  const [instruction, setInstruction] = useState(
    'Place the starting node'
  );
  const { width, height } = useWindowDimensions();
  const CELL_BORDER = 0.5;
  const GRID_PADDING = 10;
  const HEADER_HEIGHT = 120;
  const CONTROL_PANEL_WIDTH = 220;
  const CONTROL_PANEL_HEIGHT = 120;
  const isSmallScreen = width < 768;

  const availableWidth = isSmallScreen
    ? width - GRID_PADDING * 2
    : width - CONTROL_PANEL_WIDTH - GRID_PADDING * 2;

  const availableHeight = isSmallScreen
    ? height - HEADER_HEIGHT - CONTROL_PANEL_HEIGHT - GRID_PADDING * 2
    : height - HEADER_HEIGHT - GRID_PADDING * 2;

  const cellSizeFromWidth =
  availableWidth / GRID_SIZE - CELL_BORDER * 2;

  const cellSizeFromHeight =
    availableHeight / GRID_SIZE - CELL_BORDER * 2;

  const cellSize = Math.floor(
      Math.min(cellSizeFromWidth, cellSizeFromHeight)
  );
  
  const buildRequest = () => {
    let start = null;
    let end = null;
    const barriers: { x: number; y: number }[] = [];

    grid.forEach(row =>
      row.forEach(cell => {
        if (cell.type === 'start') {
          start = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'end') {
          end = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'obstacle') {
          barriers.push({ x: cell.row, y: cell.col });
        }
      })
    );

    return {
      gridSize: GRID_SIZE,
      start,
      end,
      barriers,
      algorithm: algorithm === 'A*' ? 'A_STAR' : algorithm,
    };
  };

  const resetGrid = () => {
    setIsRunning(false);
    setRunCompleted(false);
    setStartSet(false);
    setEndSet(false);
    setGrid(createGrid());
  };

  const resetPath = () => {
    setRunCompleted(false);

    setGrid(prev =>
      prev.map(row =>
        row.map(cell =>
          cell.type === 'visited' || cell.type === 'path'
            ? { ...cell, type: 'empty' }
            : cell
        )
      )
    );
  };
  const handleRunOrReset = () => {
    if (runCompleted) {
      resetPath();
    } else {
      runAlgorithm();
    }
  };
  const runAlgorithm = async () => {
    if (isRunning) return;
    if (!startSet || !endSet) return;

    setIsRunning(true);

    // // Fake visited cells
    // const visited: Cell[] = [];
    // for (let i = 5; i < 20; i++) {
    //   visited.push({ row: i, col: i, type: 'visited' });
    // }

    // // Fake path
    // const path: Cell[] = [];
    // for (let i = 20; i < 25; i++) {
    //   path.push({ row: i, col: i, type: 'path' });
    // }

    // await animateCells(visited, 'visited');
    // await animateCells(path, 'path');
    // setRunCompleted(true);
    // setInstruction('Visualization complete');
    // setIsRunning(false);
    try {
      const response = await fetch('http://localhost:8080/api/pathfind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildRequest()),
      });

      if (!response.ok) {
        throw new Error('Failed to run algorithm');
      }

      const data = await response.json();

      await animateVisited(data.visitedPath);
      await animatePath(data.path);

      setRunCompleted(true);
      setInstruction(
        data.pathFound ? 'Path found!' : 'No path found'
      );
    } catch (error) {
      console.error(error);
      setInstruction('Error running algorithm');
    } finally {
      setIsRunning(false);
    }
  };


  const animatePath = async (
    path: { x: number; y: number }[]
  ) => {
    for (const point of path) {
      setGrid(prev =>
        prev.map(row =>
          row.map(cell =>
            cell.row === point.x && cell.col === point.y
            ? (cell.type !== 'start' && cell.type !== 'end'
                ? { ...cell, type: 'path' }
                : cell
              )
            : cell
          )
        )
      );

      await new Promise(res =>
        setTimeout(res, 101 - speed)
      );
    }
  };
  const animateVisited = async (
    visited: { x: number; y: number }[]
  ) => {
    for (const point of visited) {
      setGrid(prev =>
        prev.map(row =>
          row.map(cell =>
            cell.row === point.x && cell.col === point.y
              ? (cell.type === 'empty'
                  ? { ...cell, type: 'visited' }
                  : cell)
              : cell
          )
        )
      );

      await new Promise(res =>
        setTimeout(res, 101 - speed)
      );
    }
  };
  const animateCells = async (
    cells: Cell[],
    type: CellType
  ) => {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];

      setGrid(prev =>
        prev.map(row =>
          row.map(c =>
            c.row === cell.row && c.col === cell.col
              ? { ...c, type }
              : c
          )
        )
      );

      await new Promise(res =>
        setTimeout(res, 101 - speed)
      );
    }
  };

  useEffect(() => {
    setGrid(createGrid());
  }, []);
  useEffect(() => {
    if (isRunning) {
      setInstruction('Visualizing algorithm...');
    } else if (!startSet) {
      setInstruction('Place the starting node');
    } else if (!endSet) {
      setInstruction('Place the ending node');
    } else {
      setInstruction('Draw obstacles or press PLAY');
    }
  }, [startSet, endSet, isRunning]);

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
    if (isRunning) return;

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
      return;
    }
    if (cell.type === 'obstacle' && !isPressing) {
      updateCell(cell, 'empty');
      return;
    }
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
        
        {isSmallScreen && (
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            speed={speed}
            setSpeed={setSpeed}
            allowDiagonal={allowDiagonal}
            setAllowDiagonal={setAllowDiagonal}
            isSmallScreen={isSmallScreen}
            isRunning={isRunning}
            runCompleted={runCompleted}
            onClear={resetGrid}
            onPlay={handleRunOrReset}
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
                isRunning={isRunning}
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
            isRunning={isRunning}
            runCompleted={runCompleted}
            onClear={resetGrid}
            onPlay={handleRunOrReset}
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
