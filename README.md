# Test Pipeline Simulator for iPad

An interactive test pipeline visualization app that simulates hierarchical test execution with real-time status monitoring. Runs perfectly on your iPad directly from GitHub!

## Features

- **Hierarchical Test Pipeline Structure** with 3 levels:
  - Level 0: Root pipeline node
  - Level 1: Test suites (3-5 per pipeline)
  - Level 2: Individual tests (3-5 per suite)
- **Dynamic Status LEDs** showing child node status:
  - Green: Test running
  - Blue: Test passed
  - Red: Test failed
- **Real-time Simulation** with random test completion times
- **Interactive React Flow Diagram** with pan, zoom, and exploration controls
- **Responsive Design** optimized for iPad viewing
- **Beautiful Gradients** with different colors for each hierarchy level
- No installation required - runs directly in Safari

## How to Run on Your iPad

### Option 1: GitHub Pages (Recommended)

Once GitHub Pages is enabled for this repository, you can access the app at:
```
https://[your-username].github.io/[repository-name]/
```

To enable GitHub Pages:
1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select the branch (e.g., `claude/hello-world-app-...`)
5. Click "Save"
6. Wait a few minutes for the site to deploy

### Option 2: View Raw File

You can also view the HTML file directly:
1. Navigate to the `index.html` file in your GitHub repository on your iPad
2. Tap on "Raw" button
3. The app will load and run in Safari

### Option 3: Download and Open

1. Download the `index.html` file from GitHub to your iPad
2. Open it with Safari
3. Enjoy!

## How It Works

### Test Execution Simulation

1. Click the "Run Tests" button to start the simulation
2. Each test node (Level 2) completes after a random delay (1-4 seconds)
3. Tests have an 80% pass rate (randomly determined)
4. Parent nodes (Level 1) show LEDs representing each child test's status
5. The root node (Level 0) shows LEDs representing each test suite's status
6. Watch as LEDs change from green (running) to blue (passed) or red (failed)

### Visual Elements

- **Test Pipeline Node (Purple)**: The root node at the top
- **Test Suite Nodes (Blue/Purple gradient)**: Level 1 nodes representing test suites
- **Individual Test Nodes (Cyan gradient)**: Level 2 leaf nodes representing individual tests
- **Status LEDs**: Each parent node displays LEDs for all its children
- **Animated Connections**: Lines showing the hierarchy between nodes

### LED Status Indicators

- **Green LED (Pulsing)**: Test is currently running
- **Blue LED (Steady)**: Test completed successfully
- **Red LED (Flashing)**: Test failed

## Technologies Used

- React 18 (loaded from CDN)
- React Flow 11 (for interactive node diagrams)
- HTML5
- CSS3 (with animations and gradients)
- Babel (for JSX transformation)

The app uses React hooks (useState, useEffect, useMemo, useCallback) for state management and side effects. React Flow provides the interactive node-based diagram with custom-styled nodes, hierarchical layout, and built-in controls. The simulation logic uses timeouts to create realistic test execution patterns. Everything runs directly from GitHub without a build process.

## Customization

The pipeline structure is randomly generated each time you click "Run Tests":
- Between 3-5 test suites are created
- Each test suite has between 3-5 individual tests
- Tests complete at random intervals (1-4 seconds)
- 80% of tests pass, 20% fail (configurable in the code)

## Browser Compatibility

Works best in:
- Safari (iOS/iPadOS)
- Chrome (iOS/iPadOS)
- Any modern mobile browser with JavaScript enabled

Enjoy your test pipeline simulator!
