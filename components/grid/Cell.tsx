import { Platform, StyleSheet, Pressable, Text } from 'react-native';
import { Cell as CellType } from '../../types/grid';
import { CELL_COLORS } from '../../constants/colors';

function getWebShadow(cell: CellType): object {
  if (Platform.OS !== 'web') return {};
  if (cell.state === 'path')
    return { boxShadow: '0 0 10px rgba(255,242,0,0.85), 0 0 22px rgba(255,242,0,0.35), 0 3px 8px rgba(0,0,0,0.7)' };
  if (cell.state === 'visited')
    return { boxShadow: '0 0 6px rgba(59,140,255,0.65), 0 2px 6px rgba(0,0,0,0.55)' };
  if (cell.type === 'start')
    return { boxShadow: '0 0 10px rgba(0,255,213,0.8), 0 2px 8px rgba(0,0,0,0.5)' };
  if (cell.type === 'end')
    return { boxShadow: '0 0 10px rgba(255,0,110,0.8), 0 2px 8px rgba(0,0,0,0.5)' };
  if (cell.type === 'obstacle')
    return { boxShadow: 'inset 0 2px 7px rgba(0,0,0,0.9), inset 0 1px 3px rgba(0,0,0,0.7)' };
  return {};
}

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
        getWebShadow(cell) as any,
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