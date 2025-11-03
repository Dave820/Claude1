// Flow Diagram Module
// Handles ReactFlow diagram display and test execution simulation

import { STATUS, randomInRange, generateTestPipeline } from './dataModel.js';
import { TreePanel } from './treePanel.js';

// Custom Node Component
export function TestPipelineNode({ data }) {
    // For Level 2 nodes (tests), use inline layout with LED next to label
    if (data.level === 2) {
        return React.createElement('div', { className: 'custom-node inline' },
            React.createElement('div', { className: 'node-label' }, data.label),
            data.status && React.createElement('div', { className: `led ${data.status}` })
        );
    }

    // For Level 0 and 1 nodes (pipeline and suites), use column layout
    return React.createElement('div', { className: 'custom-node' },
        React.createElement('div', { className: 'node-label' }, data.label),
        data.childStatuses && data.childStatuses.length > 0 &&
            React.createElement('div', { className: 'led-row' },
                data.childStatuses.map((status, idx) =>
                    React.createElement('div', { key: idx, className: `led ${status}` })
                )
            )
    );
}

export function FlowDiagram({ shouldRun, onRef, ReactFlowModule, Controls, Background }) {
    const { useState, useEffect, useMemo } = React;

    const [pipelineData] = useState(() => generateTestPipeline());
    const [nodes, setNodes] = useState(pipelineData.nodes);
    const [edges] = useState(pipelineData.edges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const nodeTypes = useMemo(() => ({
        testPipeline: TestPipelineNode
    }), []);

    // Save results function
    const saveResults = () => {
        const results = {
            timestamp: new Date().toISOString(),
            pipeline: {},
            suites: []
        };

        // Get root node
        const rootNode = nodes.find(n => n.data.level === 0);
        if (rootNode) {
            const rootStatuses = rootNode.data.childStatuses || [];
            const totalTests = nodes.filter(n => n.data.level === 2).length;
            const failedTests = nodes.filter(n => n.data.level === 2 && n.data.status === STATUS.FAILED).length;
            const passedTests = nodes.filter(n => n.data.level === 2 && n.data.status === STATUS.PASSED).length;
            const runningTests = nodes.filter(n => n.data.level === 2 && n.data.status === STATUS.RUNNING).length;

            results.pipeline = {
                name: rootNode.data.label,
                totalTests: totalTests,
                passed: passedTests,
                failed: failedTests,
                running: runningTests,
                status: failedTests > 0 ? 'failed' : (runningTests > 0 ? 'running' : 'passed')
            };
        }

        // Get suite nodes
        const suiteNodes = nodes.filter(n => n.data.level === 1).sort((a, b) => a.id.localeCompare(b.id));
        suiteNodes.forEach(suite => {
            const suiteTests = [];
            const testEdges = edges.filter(e => e.source === suite.id);

            testEdges.forEach(edge => {
                const testNode = nodes.find(n => n.id === edge.target);
                if (testNode) {
                    suiteTests.push({
                        name: testNode.data.label,
                        status: testNode.data.status || 'pending',
                        executionTime: testNode.data.executionTime || null,
                        startTime: testNode.data.startTime ? new Date(testNode.data.startTime).toISOString() : null,
                        endTime: testNode.data.endTime ? new Date(testNode.data.endTime).toISOString() : null
                    });
                }
            });

            const suiteStatuses = suite.data.childStatuses || [];
            const suiteFailed = suiteStatuses.some(s => s === STATUS.FAILED);
            const suiteRunning = suiteStatuses.some(s => s === STATUS.RUNNING);
            const suitePassed = suiteStatuses.every(s => s === STATUS.PASSED);

            results.suites.push({
                name: suite.data.label,
                status: suiteFailed ? 'failed' : (suiteRunning ? 'running' : (suitePassed ? 'passed' : 'pending')),
                totalTests: suiteTests.length,
                tests: suiteTests
            });
        });

        // Create JSON and download
        const json = JSON.stringify(results, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `test-results-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Expose saveResults function to parent
    useEffect(() => {
        if (onRef) {
            onRef({ saveResults });
        }
    }, [nodes, edges]);

    // Auto-fit view when nodes change visibility
    useEffect(() => {
        if (reactFlowInstance) {
            // Wait a bit for layout to settle, then fit view
            const timer = setTimeout(() => {
                reactFlowInstance.fitView({ padding: 0.2, duration: 400 });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [nodes, reactFlowInstance]);

    useEffect(() => {
        if (!shouldRun) return;

        const level2Nodes = pipelineData.nodes.filter(n => n.data.level === 2);

        level2Nodes.forEach((node) => {
            const startDelay = randomInRange(500, 3000); // Random start time
            const testDuration = randomInRange(1000, 3000); // Random test duration
            const willPass = Math.random() > 0.2; // 80% pass rate

            // Start the test - show node and set to running
            setTimeout(() => {
                setNodes(prevNodes => {
                    const newNodes = [...prevNodes];
                    const nodeIdx = newNodes.findIndex(n => n.id === node.id);
                    if (nodeIdx !== -1) {
                        newNodes[nodeIdx] = {
                            ...newNodes[nodeIdx],
                            hidden: false, // Show the node
                            data: {
                                ...newNodes[nodeIdx].data,
                                status: STATUS.RUNNING, // Set own status to running
                                startTime: Date.now() // Record start time
                            }
                        };
                    }
                    return newNodes;
                });
            }, startDelay);

            // Complete the test
            setTimeout(() => {
                const parentEdge = edges.find(e => e.target === node.id);
                if (!parentEdge) return;

                const parentId = parentEdge.source;

                setNodes(prevNodes => {
                    const newNodes = [...prevNodes];
                    const parentNode = newNodes.find(n => n.id === parentId);
                    if (!parentNode) return prevNodes;

                    const siblingEdges = edges.filter(e => e.source === parentId);
                    const childIndex = siblingEdges.findIndex(e => e.target === node.id);

                    if (childIndex !== -1) {
                        const updatedStatuses = [...parentNode.data.childStatuses];
                        updatedStatuses[childIndex] = willPass ? STATUS.PASSED : STATUS.FAILED;

                        // Update test node's own status
                        const testNodeIdx = newNodes.findIndex(n => n.id === node.id);
                        if (testNodeIdx !== -1) {
                            const endTime = Date.now();
                            const startTime = newNodes[testNodeIdx].data.startTime || endTime;
                            const executionTime = (endTime - startTime) / 1000; // Convert to seconds

                            newNodes[testNodeIdx] = {
                                ...newNodes[testNodeIdx],
                                data: {
                                    ...newNodes[testNodeIdx].data,
                                    status: willPass ? STATUS.PASSED : STATUS.FAILED,
                                    endTime: endTime,
                                    executionTime: executionTime
                                }
                            };
                        }

                        const parentIdx = newNodes.findIndex(n => n.id === parentId);
                        newNodes[parentIdx] = {
                            ...parentNode,
                            data: {
                                ...parentNode.data,
                                childStatuses: updatedStatuses
                            }
                        };

                        // Update root node status
                        const allComplete = updatedStatuses.every(s =>
                            s === STATUS.PASSED || s === STATUS.FAILED
                        );

                        if (allComplete) {
                            const rootNode = newNodes.find(n => n.data.level === 0);
                            if (rootNode) {
                                const allLevel1 = newNodes.filter(n => n.data.level === 1);
                                const level1Statuses = allLevel1.map(l1Node => {
                                    const hasFailures = l1Node.data.childStatuses.some(s => s === STATUS.FAILED);
                                    const allDone = l1Node.data.childStatuses.every(s =>
                                        s === STATUS.PASSED || s === STATUS.FAILED
                                    );
                                    if (!allDone) return STATUS.RUNNING;
                                    return hasFailures ? STATUS.FAILED : STATUS.PASSED;
                                });

                                const rootIdx = newNodes.findIndex(n => n.data.level === 0);
                                newNodes[rootIdx] = {
                                    ...rootNode,
                                    data: {
                                        ...rootNode.data,
                                        childStatuses: level1Statuses
                                    }
                                };
                            }
                        }
                    }

                    return newNodes;
                });

                // If test passed, hide it after 1 second
                if (willPass) {
                    setTimeout(() => {
                        setNodes(prevNodes => {
                            const newNodes = [...prevNodes];
                            const nodeIdx = newNodes.findIndex(n => n.id === node.id);
                            if (nodeIdx !== -1) {
                                newNodes[nodeIdx] = {
                                    ...newNodes[nodeIdx],
                                    hidden: true // Hide passed nodes
                                };
                            }
                            return newNodes;
                        });
                    }, 1000);
                }
                // If failed, keep it visible (don't hide)
            }, startDelay + testDuration);
        });
    }, [shouldRun, edges, pipelineData.nodes]);

    return React.createElement('div', { className: 'main-content' },
        React.createElement(TreePanel, { nodes: nodes, edges: edges }),
        React.createElement('div', { className: 'flow-container' },
            React.createElement(ReactFlowModule, {
                nodes: nodes,
                edges: edges,
                nodeTypes: nodeTypes,
                onInit: setReactFlowInstance,
                fitView: true,
                attributionPosition: 'bottom-left',
                minZoom: 0.3,
                maxZoom: 1.5,
                connectionLineType: 'default',
                edgesUpdatable: false,
                edgesFocusable: false,
                elementsSelectable: true
            },
                React.createElement(Controls),
                React.createElement(Background, { variant: 'dots', gap: 12, size: 1 })
            )
        )
    );
}
