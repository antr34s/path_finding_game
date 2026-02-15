import Title from '../components/Title';
import InstructionBar from '../components/InstructionBar';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { createGrid } from '../utils/createGrid';
import { Cell, CellType } from '../types/grid';
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';
import { useWindowDimensions } from 'react-native';
import { GRID_SIZE } from '../utils/createGrid';
import StatsModal from "../components/StatsModal";
type RunStats = {
  algorithm: string;
  visitedNodes: number;
  pathLength: number | string;
  pathWeight: number | string;
  gridSize: string;
};
export default function HomeScreen() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startSet, setStartSet] = useState(false);
  const [endSet, setEndSet] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState('A*');
  const [speed, setSpeed] = useState(50);
  const [selectedWeight, setSelectedWeight] = useState(Infinity);
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
    ? width - GRID_PADDING * 2 - 20
    : width - CONTROL_PANEL_WIDTH - GRID_PADDING * 2;

  const availableHeight = isSmallScreen
    ? height - HEADER_HEIGHT - CONTROL_PANEL_HEIGHT - GRID_PADDING * 2 -20
    : height - HEADER_HEIGHT - GRID_PADDING * 2;

  const cellSizeFromWidth =
  availableWidth / GRID_SIZE - CELL_BORDER * 2;

  const cellSizeFromHeight =
    availableHeight / GRID_SIZE - CELL_BORDER * 2;

  const cellSize = Math.floor(
      Math.min(cellSizeFromWidth, cellSizeFromHeight)
  );
  const [showStats, setShowStats] = useState(false);

  const [stats, setStats] = useState<RunStats>({
    algorithm: "A*",
    visitedNodes: 0,
    pathLength: 0,
    pathWeight: 0,
    gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
  });
  
  const buildRequest = () => {
    let start = null;
    let end = null;
    const barriers: { x: number; y: number; weight: number }[] = [];

    grid.forEach(row =>
      row.forEach(cell => {
        if (cell.type === 'start') {
          start = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'end') {
          end = { x: cell.row, y: cell.col };
        }
        if (cell.type === 'obstacle') {
          barriers.push({
            x: cell.row,
            y: cell.col,
            weight: cell.weight === Infinity ? -1 : cell.weight,
          });
        }
      })
    );

    return {
      gridSize: GRID_SIZE,
      start,
      end,
      barriers,
      algorithm: algorithm === 'A*' ? 'A_STAR' : algorithm,
      allowDiagonal,
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
        row.map(cell => ({
          ...cell,
          state: undefined,
        }))
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
  const getBatchSize = () => {
    if (speed < 20) return 1;
    if (speed < 40) return 2;
    if (speed < 60) return 4;
    if (speed < 80) return 10;
    if (speed < 95) return 15;
    return 20;
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
        'Press RESET to remove the visited cells or CLEAR to empty the grid'
      );
      setIsRunning(false);
      await new Promise(res => setTimeout(res, 1500));
      const rawVisited = data.visitedPath.length;
      const rawPath = data.path.length;

      const adjustedVisited = Math.max(0, rawVisited - 2);
      const adjustedPathLength =
        rawPath === 0 ? 0 : Math.max(1, rawPath - 1);

      
      let calculatedCost = -1;

      data.path.forEach((node: any) => {
        const cell = grid[node.x][node.y];
        calculatedCost += cell.weight ?? 1;
      });

      if (rawPath === 0) {
        setStats({
          algorithm: algorithm,
          visitedNodes: adjustedVisited,
          pathLength: "No path found",
          pathWeight: "No path found",
          gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
        });
      } else {
        setStats({
          algorithm: algorithm,
          visitedNodes: adjustedVisited,
          pathLength: adjustedPathLength,
          pathWeight: calculatedCost,
          gridSize: `${GRID_SIZE} x ${GRID_SIZE}`,
        });
      }

      setShowStats(true);
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
    const batchSize = getBatchSize();

    for (let i = 0; i < path.length; i += batchSize) {
      const batch = path.slice(i, i + batchSize);

      setGrid(prev =>
        prev.map(row =>
          row.map(cell => {
            if (cell.type === 'start' || cell.type === 'end')
              return cell;

            const hit = batch.find(
              p => p.x === cell.row && p.y === cell.col
            );

            if (hit) return { ...cell, state: 'path' };
            return cell;
          })
        )
      );

      await new Promise(res => requestAnimationFrame(res));
    }
  };
  const animateVisited = async (
    visited: { x: number; y: number }[]
  ) => {
    const batchSize = getBatchSize();

    for (let i = 0; i < visited.length; i += batchSize) {
      const batch = visited.slice(i, i + batchSize);

      setGrid(prev =>
        prev.map(row =>
          row.map(cell => {
            if (cell.type === 'start' || cell.type === 'end')
              return cell;

            const hit = batch.find(
              p => p.x === cell.row && p.y === cell.col
            );

            if (hit) return { ...cell, state: 'visited' };
            return cell;
          })
        )
      );

      await new Promise(res => requestAnimationFrame(res));
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
      return;
    }

    if (runCompleted) {
      setInstruction(
        'Press RESET to remove the visited cells or CLEAR to empty the grid'
      );
      return;
    }

    if (!startSet) {
      setInstruction('Click where you want to place the starting point');
    } else if (!endSet) {
      setInstruction('Click where you want to place the ending point');
    } else {
      setInstruction(
        "Choose the obstacles' cost on the right side and click to place them or press PLAY"
      );
    }
  }, [startSet, endSet, isRunning, runCompleted]);

  const updateCell = (cell: Cell, newType: CellType) => {
    setGrid(prev =>
      prev.map(row =>
        row.map(c =>
          c.row === cell.row && c.col === cell.col
            ? { ...c, type: newType, weight: cell.weight ?? c.weight }
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
      updateCell({ ...cell, weight: selectedWeight }, 'obstacle');
      return;
    }

    if (cell.type === 'obstacle' && !isPressing) {
      updateCell({ ...cell, weight: 1 }, 'empty');
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
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
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
                selectedWeight={selectedWeight}
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
            selectedWeight={selectedWeight}
            setSelectedWeight={setSelectedWeight}
          />
        )}
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
          © 2026 Antreas Panagi & Michael Panaetov
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
