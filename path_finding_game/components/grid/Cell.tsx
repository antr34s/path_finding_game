import { StyleSheet, Pressable, Text } from 'react-native';
import { Cell as CellType } from '../../types/grid';
import { CELL_COLORS } from '../../constants/colors';

interface Props {
  cell: CellType;
  size: number;
  onPress: (cell: CellType) => void;
  onPressIn: () => void;
  onPressOut: () => void;
  isPressing: boolean;
}

export default function Cell({
  cell,
  size,
  onPress,
  onPressIn,
  onPressOut,
  isPressing,
}: Props) {
  let background = CELL_COLORS.empty;

  if (cell.type === 'start') background = CELL_COLORS.start;
  else if (cell.type === 'end') background = CELL_COLORS.end;
  else if (cell.type === 'obstacle') background = CELL_COLORS.obstacle;

  if (cell.state === 'visited') background = CELL_COLORS.visited;
  if (cell.state === 'path') background = CELL_COLORS.path;

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(cell)}
      onHoverIn={() => {
        if (isPressing) onPress(cell);
      }}
      style={[
        styles.cell,
        {
          backgroundColor: background,
          width: size,
          height: size,
        },
      ]}
    >
      {cell.type === 'obstacle' && cell.weight !== Infinity && (
        <Text selectable={false} style={styles.weightNumber}>
          {cell.weight}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: '#00ffcc',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  weightNumber: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#ff00ff',
    textShadowRadius: 4,
  },
});