// Main App Module
// Top-level application component with controls

import { FlowDiagram } from './flowDiagram.js';

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
        })
    );
}
