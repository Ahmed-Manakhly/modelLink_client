import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import ModelViewSection from './ModelViewSection';

const MetricsComparisonTable = ({ versions = [], fluid = false }) => {
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
        <ModelViewSection title="Metrics Comparison" fluid={fluid}>
            <div className="mui-table-scroller mt-5 pt-3 w-100">
                <Table variant="dark" bordered hover size="sm" className="mb-0 PageTable" style={{ minWidth: 'max-content', width: '100%', background: 'var(--surface-glass)', backdropFilter: 'blur(var(--glass-blur))', whiteSpace: 'nowrap' }}>
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
                                                        <div className="mt-1">
                                                            <a href={cell.metricsUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '13px', textDecoration: 'underline' }}>Details</a>
                                                        </div>
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
