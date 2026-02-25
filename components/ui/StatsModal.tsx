import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const webGlassStyle: object = Platform.OS === 'web' ? {
  backdropFilter: 'blur(32px) saturate(160%) brightness(1.08)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%) brightness(1.08)',
  backgroundColor: 'rgba(10, 6, 20, 0.22)',
  boxShadow: '0 8px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.15)',
  borderColor: 'rgba(255, 255, 255, 0.07)',
} as any : {};


interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
  stats: {
    algorithm: string;
    visitedNodes: number;
    pathLength: number | string;
    pathWeight: number | string;
    gridSize: string;
  };
  isSmallScreen: boolean;
  controlPanelWidth: number;
}

export default function StatsModal({
  visible,
  onClose,
  stats,
  isSmallScreen,
  controlPanelWidth,
}: StatsModalProps) {
    const leftOffset = isSmallScreen ? 0 : -controlPanelWidth / 2;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale   = useRef(new Animated.Value(0.92)).current;
    const translateY = useRef(new Animated.Value(16)).current;

    useEffect(() => {
      if (visible) {
        opacity.setValue(0);
        scale.setValue(0.92);
        translateY.setValue(16);
        Animated.parallel([
          Animated.timing(opacity,     { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(scale,       { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(translateY,  { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
      }
    }, [visible]);

    const StatRow = ({ label, value }: { label: string; value: any }) => (
        <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>{label}</Text>
            <Text selectable={false} style={styles.value}>{value}</Text>
        </View>
    );
    return (
      <Modal transparent animationType="none" visible={visible}>
        <Animated.View style={[styles.overlay, { opacity }]}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateX: leftOffset }, { scale }, { translateY }],
              },
              webGlassStyle,
            ]}
          >
            <Text selectable={false} style={styles.title}>Run Statistics</Text>

            <StatRow label="Algorithm:"     value={stats.algorithm} />
            <StatRow label="Visited Nodes:" value={stats.visitedNodes} />
            <StatRow label="Path Length:"   value={stats.pathLength} />
            <StatRow label="Path Cost:"     value={stats.pathWeight} />
            <StatRow label="Grid Size:"     value={stats.gridSize} />

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text selectable={false} style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 320,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00ffcc",
    marginBottom: 20,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    color: "#aaa",
  },
  value: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00ffcc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
});
