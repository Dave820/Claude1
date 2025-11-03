// Data Model Module
// Handles test pipeline generation and status constants

// Test status constants
export const STATUS = {
    RUNNING: 'running',
    PASSED: 'passed',
    FAILED: 'failed'
};

// Utility function for random number generation
export const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate hierarchical test pipeline structure (LEFT TO RIGHT)
export function generateTestPipeline() {
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    const rootId = `node-${nodeId++}`;
    const level1Count = randomInRange(3, 5);

    // Calculate vertical spacing for level 1 nodes
    const level1YSpacing = 120;
    const level1YStart = 50;

    // Level 0 - Root node on the left, centered vertically
    const rootY = level1YStart + (level1Count * level1YSpacing) / 2;

    nodes.push({
        id: rootId,
        type: 'testPipeline',
        data: {
            label: 'Test Pipeline',
            childStatuses: Array(level1Count).fill(STATUS.RUNNING),
            level: 0
        },
        position: { x: 50, y: rootY },
        className: 'level-0'
    });

    // Level 1 - Test suites in the middle column
    const level1X = 350;

    for (let i = 0; i < level1Count; i++) {
        const level1Id = `node-${nodeId++}`;
        const level2Count = randomInRange(3, 5);

        const level1Y = level1YStart + (i * level1YSpacing);

        nodes.push({
            id: level1Id,
            type: 'testPipeline',
            data: {
                label: `Suite ${i + 1}`,
                childStatuses: Array(level2Count).fill(STATUS.RUNNING),
                level: 1
            },
            position: { x: level1X, y: level1Y },
            className: 'level-1'
        });

        edges.push({
            id: `edge-${rootId}-${level1Id}`,
            source: rootId,
            target: level1Id
        });

        // Level 2 - Individual tests on the right column
        const level2X = 700;
        const level2YSpacing = 80;
        const level2YStart = level1Y - ((level2Count - 1) * level2YSpacing) / 2;

        for (let j = 0; j < level2Count; j++) {
            const level2Id = `node-${nodeId++}`;
            const level2Y = level2YStart + (j * level2YSpacing);

            nodes.push({
                id: level2Id,
                type: 'testPipeline',
                data: {
                    label: `Test ${i + 1}.${j + 1}`,
                    childStatuses: [],
                    level: 2,
                    status: null // Will be set to running/passed/failed
                },
                position: { x: level2X, y: level2Y },
                className: 'level-2',
                hidden: true // Initially hide all test nodes
            });

            edges.push({
                id: `edge-${level1Id}-${level2Id}`,
                source: level1Id,
                target: level2Id
            });
        }
    }

    return { nodes, edges };
}
