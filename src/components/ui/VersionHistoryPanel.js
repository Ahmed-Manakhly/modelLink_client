import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import ModelViewSection from './ModelViewSection';

const VersionHistoryPanel = ({ versions = [], selectedVersionId, onSelect, showInactive = false }) => {
    if (!versions.length) return null;

    const rows = showInactive ? versions : versions.filter((v) => v.isActive !== false);
    if (!rows.length) return null;

    return (
        <ModelViewSection title="Version History">
            <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table striped bordered hover size="sm" className="mb-0 w-100">
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
                                    style={selected ? { background: '#e8f4fd' } : undefined}
                                    onClick={() => onSelect?.(v.id)}
                                >
                                    <td>
                                        v{v.version}
                                        {v.isPrimary && <Badge bg="primary" className="ms-1">Primary</Badge>}
                                    </td>
                                    <td>${Number(v.price || 0).toFixed(2)}</td>
                                    <td>{v.deliveryTime ?? 'N/A'} day(s)</td>
                                    <td>{v.modalityRel?.name || '—'}</td>
                                    <td>{v.bodyPartRel?.name || '—'}</td>
                                    <td>
                                        {v.isActive === false
                                            ? <Badge bg="secondary">Inactive</Badge>
                                            : <Badge bg="success">Active</Badge>}
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant={selected ? 'primary' : 'outline-primary'}
                                            onClick={(e) => { e.stopPropagation(); onSelect?.(v.id); }}
                                        >
                                            {selected ? 'Selected' : 'Select'}
                                        </Button>
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
