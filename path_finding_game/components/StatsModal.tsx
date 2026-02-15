import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

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
  
    return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.container, { transform: [{ translateX: leftOffset }] }]}>
          <Text selectable={false} style={styles.title}>Run Statistics</Text>

          <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>Algorithm:</Text>
            <Text selectable={false} style={styles.value}>{stats.algorithm}</Text>
          </View>

          <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>Visited Nodes:</Text>
            <Text selectable={false} style={styles.value}>{stats.visitedNodes}</Text>
          </View>

          <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>Path Length:</Text>
            <Text selectable={false} style={styles.value}>{stats.pathLength}</Text>
          </View>

          <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>Path Cost:</Text>
            <Text selectable={false} style={styles.value}>{stats.pathWeight}</Text>
          </View>

          <View style={styles.statRow}>
            <Text selectable={false} style={styles.label}>Grid Size:</Text>
            <Text selectable={false} style={styles.value}>{stats.gridSize}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text selectable={false} style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 320,
    backgroundColor: "#111",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#00ffcc",
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