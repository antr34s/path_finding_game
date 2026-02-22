# AlgoGraph

**AlgoGraph** is an interactive pathfinding algorithm visualizer that lets you watch classic search algorithms explore a grid in real time. Place a start and end point, draw obstacles, pick an algorithm, and hit play — then watch the algorithm find its way.

Live at: [algograph.io](https://algograph.io)

---

## What It Does

AlgoGraph renders a 30×30 interactive grid where you can:

- **Visualize 4 pathfinding algorithms** step by step:
  - **A\*** — Heuristic-based optimal search
  - **Dijkstra** — Weighted optimal pathfinding
  - **BFS** (Breadth-First Search) — Shortest path in unweighted graphs
  - **DFS** (Depth-First Search) — Depth-based exploration

- **Customize the grid:**
  - Place start and end points anywhere on the grid
  - Draw walls (impassable obstacles) or weighted cells (cost 2–9)
  - Toggle between 4-directional and 8-directional (diagonal) movement

- **Control the visualization:**
  - Adjust animation speed with a slider
  - Play, pause, and clear the board at any time

- **View run statistics** after each execution:
  - Nodes visited, path length, total path weight, execution time, and grid size

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Expo](https://expo.dev) / [React Native](https://reactnative.dev) | Cross-platform app (iOS, Android, Web) |
| TypeScript | Type-safe development |
| Expo Router | File-based navigation |
| React Native Reanimated | Smooth cell animations |
| React Native Community Slider | Speed control |
| Vercel | Web deployment |

### Backend
| Technology | Purpose |
|---|---|
| [Spring Boot 4](https://spring.io/projects/spring-boot) | REST API framework |
| Java 21 | Backend language |
| Maven | Build and dependency management |
| Lombok | Boilerplate reduction |

The frontend communicates with the backend via a REST API (`POST /api/pathfind`). The backend executes the selected algorithm on the provided grid and returns the visited nodes and shortest path.

---

## Project Structure

```
algograph/
├── app/                   # Expo screens (file-based routing)
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Main grid screen
├── components/
│   ├── grid/              # Grid and Cell components
│   └── ui/                # ControlPanel, StatsModal, InstructionBar, etc.
├── hooks/
│   ├── useGrid.ts         # Grid state and interactions
│   └── usePathfinding.ts  # Algorithm execution and animation
├── services/
│   └── api.ts             # Backend API client
├── types/                 # TypeScript interfaces
├── utils/                 # Grid initialization and config helpers
└── backend/
    └── src/main/java/com/algofind/
        ├── controller/    # REST endpoints
        ├── service/
        │   └── algorithm/ # A*, Dijkstra, BFS, DFS implementations
        ├── model/         # GridGraph model
        ├── dto/           # Request / Response DTOs
        ├── config/        # CORS and exception handling
        └── util/          # Path reconstruction utilities
```

---

## How to Run Locally

### Prerequisites
- **Node.js** (v18+) and npm
- **Java 21** and Maven
- Expo Go app (for mobile testing) or an iOS/Android emulator

---

### 1. Start the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.

---

### 2. Start the Frontend

```bash
# From the project root
npm install
npm start
```

In the Expo output, choose your target:

| Key | Target |
|---|---|
| `w` | Web browser |
| `a` | Android emulator |
| `i` | iOS simulator |
| Scan QR | Expo Go on your device |

> **Note:** By default the frontend points to `https://api.algograph.io`. To use your local backend, update `EXPO_PUBLIC_API_URL` in [.env](.env) to `http://localhost:8080`.

---

### 3. Using the App

1. **Set start point** — tap any cell to place the green start marker
2. **Set end point** — tap another cell to place the red end marker
3. **Draw obstacles** — tap and drag remaining cells to add walls or weighted costs
4. **Choose an algorithm** — select A\*, Dijkstra, BFS, or DFS from the control panel
5. **Adjust speed** — use the slider to slow down or speed up the animation
6. **Run** — press Play and watch the algorithm explore the grid
7. **View stats** — a summary of the run appears when the algorithm finishes
8. **Clear** — press Clear to reset the grid and try again

---

## API Reference

### `POST /api/pathfind`

**Request body:**
```json
{
  "algorithm": "ASTAR",
  "start": { "row": 0, "col": 0 },
  "end": { "row": 29, "col": 29 },
  "grid": [[1, 1, ...], ...],
  "allowDiagonal": false
}
```

**Response:**
```json
{
  "visitedNodes": [[0,0], [0,1], ...],
  "path": [[0,0], [1,1], ...],
  "pathLength": 42,
  "pathWeight": 48,
  "visitedCount": 310,
  "executionTimeMs": 3
}
```

Grid cell values: `1` = passable, `0` = wall, `2–9` = weighted cost.

---

## License & Copyright

&copy; 2026 **Michail Panaetov** and **Antreas Panagi**. All rights reserved.

This software and its source code are the intellectual property of Michail Panaetov and Antreas Panagi. Unauthorized copying, distribution, or modification of this project, in whole or in part, without explicit written permission from the authors is strictly prohibited.
