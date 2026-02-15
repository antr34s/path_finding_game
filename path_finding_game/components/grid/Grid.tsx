import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { Cell as CellType } from '../../types/grid';

interface Props {
  grid: CellType[][];
  cellSize: number;
  onCellPress: (cell: CellType) => void;
  onPressIn: () => void;
  onPressOut: () => void;
  isPressing: boolean;
  isRunning: boolean;
  selectedWeight: number;
}

export default function Grid({
  grid,
  cellSize,
  onCellPress,
  onPressIn,
  onPressOut,
  isPressing,
}: Props) {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(cell => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              size={cellSize}
              onPress={onCellPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              isPressing={isPressing}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
});