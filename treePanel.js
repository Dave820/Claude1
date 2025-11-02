// Tree Panel Module
// Displays hierarchical test tree with status and execution time

import { STATUS } from './dataModel.js';

export function TreePanel({ nodes, edges }) {
    const { useState } = React;

    // State to track which suites are expanded (all expanded by default)
    const suiteNodes = nodes.filter(n => n.data.level === 1).sort((a, b) => a.id.localeCompare(b.id));
    const initialExpanded = {};
    suiteNodes.forEach(suite => {
        initialExpanded[suite.id] = true;
    });

    const [expandedSuites, setExpandedSuites] = useState(initialExpanded);

    // Build hierarchical structure
    const rootNode = nodes.find(n => n.data.level === 0);

    const getTestsForSuite = (suiteId) => {
        const testEdges = edges.filter(e => e.source === suiteId);
        return testEdges.map(edge => nodes.find(n => n.id === edge.target)).filter(Boolean);
    };

    const getSuiteStatus = (suite) => {
        const statuses = suite.data.childStatuses || [];
        if (statuses.some(s => s === STATUS.FAILED)) return 'failed';
        if (statuses.every(s => s === STATUS.PASSED)) return 'passed';
        if (statuses.some(s => s === STATUS.RUNNING)) return 'running';
        return 'pending';
    };

    const toggleSuite = (suiteId) => {
        setExpandedSuites(prev => ({
            ...prev,
            [suiteId]: !prev[suiteId]
        }));
    };

    const formatTime = (executionTime) => {
        if (executionTime === undefined || executionTime === null) return '-';
        return executionTime.toFixed(2) + 's';
    };

    return React.createElement('div', { className: 'tree-panel' },
        React.createElement('h3', null, 'Test Hierarchy'),

        // Table structure
        React.createElement('table', { className: 'tree-table' },
            // Table headers
            React.createElement('thead', null,
                React.createElement('tr', null,
                    React.createElement('th', { className: 'col-name' }, 'Name'),
                    React.createElement('th', { className: 'col-status' }, 'Status'),
                    React.createElement('th', { className: 'col-time' }, 'Time')
                )
            ),

            // Table body
            React.createElement('tbody', null,
                // Root node
                rootNode && React.createElement('tr', {
                    className: 'tree-row level-0',
                    key: rootNode.id
                },
                    React.createElement('td', { className: 'col-name' },
                        React.createElement('span', { className: 'tree-label' }, rootNode.data.label)
                    ),
                    React.createElement('td', { className: 'col-status' },
                        React.createElement('div', { className: 'status-badge' })
                    ),
                    React.createElement('td', { className: 'col-time' }, '-')
                ),

                // Suite nodes
                suiteNodes.map(suite => {
                    const tests = getTestsForSuite(suite.id);
                    const suiteStatus = getSuiteStatus(suite);
                    const isExpanded = expandedSuites[suite.id];

                    // Calculate passed tests count
                    const totalTests = tests.length;
                    const passedTests = tests.filter(test => test.data.status === STATUS.PASSED).length;
                    const statusText = `${passedTests} of ${totalTests}`;

                    return React.createElement(React.Fragment, { key: suite.id },
                        React.createElement('tr', {
                            className: 'tree-row level-1',
                            onClick: () => toggleSuite(suite.id)
                        },
                            React.createElement('td', { className: 'col-name' },
                                React.createElement('div', {
                                    className: `tree-toggle ${isExpanded ? '' : 'collapsed'}`
                                }, '▼'),
                                React.createElement('span', { className: 'tree-label' }, suite.data.label)
                            ),
                            React.createElement('td', { className: 'col-status' },
                                React.createElement('div', { className: 'status-cell' },
                                    React.createElement('div', { className: `status-badge ${suiteStatus}` }),
                                    React.createElement('span', { className: 'status-count' }, statusText)
                                )
                            ),
                            React.createElement('td', { className: 'col-time' }, '-')
                        ),

                        // Test nodes for this suite (only if expanded)
                        isExpanded && tests.map(test => {
                            const isHidden = test.hidden;
                            const testStatus = test.data.status || 'pending';
                            const executionTime = test.data.executionTime;

                            return React.createElement('tr', {
                                className: `tree-row level-2 ${isHidden ? 'hidden-node' : ''}`,
                                key: test.id
                            },
                                React.createElement('td', { className: 'col-name' },
                                    React.createElement('span', { className: 'tree-label' }, test.data.label)
                                ),
                                React.createElement('td', { className: 'col-status' },
                                    React.createElement('div', { className: `status-badge ${testStatus}` })
                                ),
                                React.createElement('td', { className: 'col-time' }, formatTime(executionTime))
                            );
                        })
                    );
                })
            )
        )
    );
}
