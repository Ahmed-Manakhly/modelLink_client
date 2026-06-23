import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import ModelViewSection from './ModelViewSection';

const MetricsComparisonTable = ({ versions = [] }) => {
    const activeVersions = versions.filter((v) => v.isActive !== false);

    const { metricNames, matrix } = useMemo(() => {
        const names = new Set();
        activeVersions.forEach((v) => {
            (v.metrics || []).forEach((m) => names.add(m.metric));
        });
        const sorted = [...names].sort();
        const map = {};
        sorted.forEach((name) => {
            map[name] = {};
            activeVersions.forEach((v) => {
                const found = (v.metrics || []).find((m) => m.metric === name);
                map[name][v.id] = found || null;
            });
        });
        return { metricNames: sorted, matrix: map };
    }, [activeVersions]);

    if (!activeVersions.length) return null;

    return (
        <ModelViewSection title="Metrics Comparison">
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table striped bordered size="sm" className="mb-0 w-100">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            {activeVersions.map((v) => (
                                <th key={v.id}>v{v.version}{v.isPrimary ? ' ★' : ''}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metricNames.length === 0 ? (
                            <tr>
                                <td colSpan={activeVersions.length + 1} style={{ color: '#666', fontStyle: 'italic' }}>
                                    No metrics recorded for this model yet.
                                </td>
                            </tr>
                        ) : metricNames.map((name) => (
                            <tr key={name}>
                                <td><strong>{name}</strong></td>
                                {activeVersions.map((v) => {
                                    const cell = matrix[name][v.id];
                                    return (
                                        <td key={v.id}>
                                            {cell ? (
                                                <>
                                                    {cell.value}%
                                                    {cell.metricsUrl && (
                                                        <> {' '}<a href={cell.metricsUrl} target="_blank" rel="noreferrer">Details</a></>
                                                    )}
                                                </>
                                            ) : '—'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </ModelViewSection>
    );
};

export default MetricsComparisonTable;
