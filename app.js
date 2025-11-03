// Main App Module
// Top-level application component with controls

import { FlowDiagram } from './flowDiagram.js';

// Simple test nodes and edges for debugging
const testNodes = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
    { id: '2', position: { x: 300, y: 100 }, data: { label: 'Node 2' } },
    { id: '3', position: { x: 500, y: 100 }, data: { label: 'Node 3' } }
];

const testEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' }
];

export function App({ ReactFlowModule, Controls, Background }) {
    const { useState } = React;

    const [key, setKey] = useState(0);
    const [flowDiagramRef, setFlowDiagramRef] = useState(null);

    // Git commit version timestamp (update on each commit)
    const VERSION = '2025-11-03 21:41:04';

    const handleRunTests = () => {
        setKey(prev => prev + 1);
    };

    const handleSaveResults = () => {
        if (flowDiagramRef && flowDiagramRef.saveResults) {
            flowDiagramRef.saveResults();
        }
    };

    return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'header-bar' },
                React.createElement('h1', null, 'Test Pipeline Simulator'),
                React.createElement('div', { className: 'version-info' }, `Version: ${VERSION}`)
            ),
            React.createElement('div', { className: 'controls' },
                React.createElement('button', { onClick: handleRunTests }, 'Run Tests'),
                React.createElement('button', { onClick: handleSaveResults }, 'Save Results')
            )
        ),
        React.createElement(FlowDiagram, {
            key: key,
            shouldRun: true,
            onRef: setFlowDiagramRef,
            ReactFlowModule: ReactFlowModule,
            Controls: Controls,
            Background: Background
        }),
        // Debug test frame with basic React Flow
        React.createElement('div', { className: 'test-container' },
            React.createElement('h3', null, 'Debug: Basic React Flow Test'),
            React.createElement('p', { style: { fontSize: '0.9em', color: '#666', marginBottom: '10px' } },
                `Nodes: ${testNodes.length}, Edges: ${testEdges.length}`
            ),
            React.createElement('pre', { style: { fontSize: '0.8em', background: '#f5f5f5', padding: '10px', marginBottom: '10px' } },
                JSON.stringify({ nodes: testNodes, edges: testEdges }, null, 2)
            ),
            React.createElement('div', { className: 'test-flow' },
                React.createElement(ReactFlowModule, {
                    nodes: testNodes,
                    edges: testEdges,
                    fitView: true,
                    onInit: (instance) => console.log('Test ReactFlow initialized:', instance),
                    onNodesChange: (changes) => console.log('Nodes changed:', changes),
                    onEdgesChange: (changes) => console.log('Edges changed:', changes)
                },
                    React.createElement(Controls),
                    React.createElement(Background)
                )
            )
        )
    );
}
