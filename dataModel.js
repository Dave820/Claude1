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

    // First pass: determine test counts for each suite to calculate proper spacing
    const suitesInfo = [];
    for (let i = 0; i < level1Count; i++) {
        suitesInfo.push({
            testCount: randomInRange(3, 5)
        });
    }

    // Calculate total height needed and positions
    const level2YSpacing = 80;
    const suiteGap = 40; // Gap between different suites' test groups
    let currentTestY = 50;

    // Calculate suite Y positions (centered with their test groups)
    for (let i = 0; i < level1Count; i++) {
        const testGroupHeight = (suitesInfo[i].testCount - 1) * level2YSpacing;
        suitesInfo[i].suiteY = currentTestY + testGroupHeight / 2;
        suitesInfo[i].testsStartY = currentTestY;
        currentTestY += testGroupHeight + suiteGap;
    }

    // Calculate total height and center the root node
    const totalHeight = currentTestY - suiteGap - 50;
    const rootY = 50 + totalHeight / 2;

    // Level 0 - Root node on the left, centered vertically
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

    // Level 1 and 2 - Suites and tests
    const level1X = 350;
    const level2X = 700;

    for (let i = 0; i < level1Count; i++) {
        const level1Id = `node-${nodeId++}`;
        const suiteInfo = suitesInfo[i];

        nodes.push({
            id: level1Id,
            type: 'testPipeline',
            data: {
                label: `Suite ${i + 1}`,
                childStatuses: Array(suiteInfo.testCount).fill(STATUS.RUNNING),
                level: 1
            },
            position: { x: level1X, y: suiteInfo.suiteY },
            className: 'level-1'
        });

        edges.push({
            id: `edge-${rootId}-${level1Id}`,
            source: rootId,
            target: level1Id,
            sourceHandle: 'source',
            targetHandle: 'target'
        });

        // Level 2 - Individual tests for this suite
        for (let j = 0; j < suiteInfo.testCount; j++) {
            const level2Id = `node-${nodeId++}`;
            const level2Y = suiteInfo.testsStartY + (j * level2YSpacing);

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
                target: level2Id,
                sourceHandle: 'source',
                targetHandle: 'target'
            });
        }
    }

    return { nodes, edges };
}
