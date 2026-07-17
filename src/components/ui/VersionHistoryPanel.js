import React from 'react';
import { Table } from 'react-bootstrap';
import ModelViewSection from './ModelViewSection';

const VersionHistoryPanel = ({ versions = [], selectedVersionId, onSelect, showInactive = false, fluid = false }) => {
    if (!versions.length) return null;

    const rows = showInactive ? versions : versions.filter((v) => v.isActive !== false);
    if (!rows.length) return null;

    return (
        <ModelViewSection title="Version History" fluid={fluid}>
            <div className="mui-table-scroller w-100">
                <Table variant="dark" bordered hover size="sm" className="mb-0 PageTable" style={{ minWidth: 'max-content', width: '100%', background: 'var(--surface-glass)', backdropFilter: 'blur(var(--glass-blur))', whiteSpace: 'nowrap' }}>
                <thead>
                        <tr>
                            <th>Version</th>
                            <th>Price</th>
                            <th>Delivery</th>
                            <th>Modality</th>
                            <th>Body Part</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((v) => {
                            const selected = selectedVersionId === v.id;
                            return (
                                <tr
                                    key={v.id}
                                    style={selected ? { background: 'rgba(34, 211, 238, 0.1)' } : undefined}
                                    onClick={() => onSelect?.(v.id)}
                                >
                                    <td>
                                        v{v.version}
                                        {v.isPrimary && <span className="ms-2" style={{ display: 'inline-block', background: 'var(--surface-glass)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px', boxShadow: '0 0 8px rgba(34, 211, 238, 0.15)' }}>Primary</span>}
                                    </td>
                                    <td>${Number(v.price || 0).toFixed(2)}</td>
                                    <td>{v.deliveryTime ?? 'N/A'} day(s)</td>
                                    <td>{v.modalityRel?.name || '—'}</td>
                                    <td>{v.bodyPartRel?.name || '—'}</td>
                                    <td>
                                        {v.isActive === false
                                            ? <span style={{ display: 'inline-block', background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--on-surface-variant)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px' }}>Inactive</span>
                                            : <span style={{ display: 'inline-block', background: 'transparent', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, letterSpacing: '0.5px', fontSize: '12px', boxShadow: '0 0 8px rgba(16, 185, 129, 0.2)' }}>Active</span>}
                                    </td>
                                    <td>
                                        <button
                                            className={selected ? "btn-glass-primary" : "btn-glass-outline"}
                                            style={{ padding: '4px 12px', fontSize: '0.85rem' }}
                                            onClick={(e) => { e.stopPropagation(); onSelect?.(v.id); }}
                                        >
                                            {selected ? 'Selected' : 'Select'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </ModelViewSection>
    );
};

export default VersionHistoryPanel;
