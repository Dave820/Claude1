// Main App Module
// Top-level application component with controls

import { FlowDiagram } from './flowDiagram.js';

export function App({ ReactFlowModule, Controls, Background }) {
    const { useState } = React;

    const [key, setKey] = useState(0);
    const [flowDiagramRef, setFlowDiagramRef] = useState(null);

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
            React.createElement('h1', null, 'Test Pipeline Simulator'),
            React.createElement('p', null, 'Hierarchical test pipeline visualization with real-time status monitoring'),
            React.createElement('div', { className: 'controls' },
                React.createElement('button', { onClick: handleRunTests }, 'Run Tests'),
                React.createElement('button', { onClick: handleSaveResults }, 'Save Results')
            ),
            React.createElement('div', { className: 'legend' },
                React.createElement('div', { className: 'legend-item' },
                    React.createElement('div', { className: 'legend-led running' }),
                    React.createElement('span', null, 'Running')
                ),
                React.createElement('div', { className: 'legend-item' },
                    React.createElement('div', { className: 'legend-led passed' }),
                    React.createElement('span', null, 'Passed')
                ),
                React.createElement('div', { className: 'legend-item' },
                    React.createElement('div', { className: 'legend-led failed' }),
                    React.createElement('span', null, 'Failed')
                )
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
