import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Table, Tabs, Tab, Alert } from 'react-bootstrap';
import Modal from '../layout/Modal';
import { uiActions } from '../../store/UI-slice';
import { FILES_BASE_API_URL } from '../../lib/api';
import {
    getCategoriesManageReq,
    getCategoryImpactReq,
    createCategoryReq,
    updateCategoryReq,
    deleteCategoryReq,
    getModalitiesManageReq,
    getModalityImpactReq,
    createModalityReq,
    updateModalityReq,
    deleteModalityReq,
    getBodyPartsManageReq,
    getBodyPartImpactReq,
    createBodyPartReq,
    updateBodyPartReq,
    deleteBodyPartReq,
    slugify,
} from '../../lib/taxonomyRequests';

const notify = (dispatch, status, title, message) => {
    dispatch(uiActions.notificationDataChanged({ status, title, message }));
    dispatch(uiActions.showNotification(true));
};

function AdminTaxonomySection({ token }) {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('categories');

    const [categories, setCategories] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [bodyParts, setBodyParts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formModal, setFormModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const loadCategories = useCallback(async () => {
        const res = await getCategoriesManageReq(token);
        setCategories(res.data?.data?.categories || []);
    }, [token]);

    const loadModalities = useCallback(async () => {
        const res = await getModalitiesManageReq(token);
        setModalities(res.data?.data?.modalities || []);
    }, [token]);

    const loadBodyParts = useCallback(async () => {
        const res = await getBodyPartsManageReq(token);
        setBodyParts(res.data?.data?.bodyParts || []);
    }, [token]);

    const reload = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            await Promise.all([loadCategories(), loadModalities(), loadBodyParts()]);
        } catch (err) {
            notify(dispatch, 'error', 'Taxonomy', err.response?.data?.message || err.message || 'Failed to load taxonomy');
        } finally {
            setLoading(false);
        }
    }, [token, loadCategories, loadModalities, loadBodyParts, dispatch]);

    useEffect(() => {
        reload();
    }, [reload]);

    const openDelete = async (type, item) => {
        try {
            let impactRes;
            if (type === 'category') impactRes = await getCategoryImpactReq(item.id, token);
            else if (type === 'modality') impactRes = await getModalityImpactReq(item.id, token);
            else impactRes = await getBodyPartImpactReq(item.id, token);

            setDeleteModal({
                type,
                item,
                impact: impactRes.data?.data || {},
                reassignModelsTo: '',
                reassignChildrenTo: '',
                reassignVersionsTo: '',
            });
        } catch (err) {
            notify(dispatch, 'error', 'Delete', err.response?.data?.message || err.message || 'Could not load delete impact');
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;
        const { type, item, reassignModelsTo, reassignChildrenTo, reassignVersionsTo } = deleteModal;
        try {
            if (type === 'category') {
                await deleteCategoryReq(item.id, {
                    reassignModelsTo: reassignModelsTo || undefined,
                    reassignChildrenTo: reassignChildrenTo === '__top__' ? null : (reassignChildrenTo || undefined),
                }, token);
            } else if (type === 'modality') {
                await deleteModalityReq(item.id, { reassignVersionsTo: reassignVersionsTo || undefined }, token);
            } else {
                await deleteBodyPartReq(item.id, { reassignVersionsTo: reassignVersionsTo || undefined }, token);
            }
            setDeleteModal(null);
            notify(dispatch, 'success', 'Deleted', `${item.name} removed.`);
            reload();
        } catch (err) {
            notify(dispatch, 'error', 'Delete failed', err.response?.data?.message || err.message || 'Could not delete');
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (!formModal) return;
        const { type, mode, values, iconFile, id } = formModal;

        try {
            if (type === 'category') {
                const payload = {
                    name: values.name.trim(),
                    slug: values.slug.trim(),
                    parentId: values.isParent ? null : (values.parentId || null),
                };
                const formData = new FormData();
                formData.append('data', JSON.stringify(payload));
                if (iconFile) formData.append('icon', iconFile);
                if (mode === 'create') await createCategoryReq(formData, token);
                else await updateCategoryReq(id, formData, token);
            } else {
                const payload = { name: values.name.trim(), slug: values.slug.trim() };
                if (mode === 'create') {
                    if (type === 'modality') await createModalityReq(payload, token);
                    else await createBodyPartReq(payload, token);
                } else if (type === 'modality') {
                    await updateModalityReq(id, payload, token);
                } else {
                    await updateBodyPartReq(id, payload, token);
                }
            }
            setFormModal(null);
            notify(dispatch, 'success', 'Saved', 'Taxonomy updated.');
            reload();
        } catch (err) {
            notify(dispatch, 'error', 'Save failed', err.response?.data?.message || err.message || 'Could not save');
        }
    };

    const openCategoryForm = (mode, item = null, parentId = null) => {
        const isParent = mode === 'create' ? !parentId : item?.parentId == null;
        setFormModal({
            type: 'category',
            mode,
            id: item?.id,
            iconFile: null,
            values: {
                name: item?.name || '',
                slug: item?.slug || '',
                isParent,
                parentId: item?.parentId ?? parentId ?? '',
            },
        });
    };

    const openSimpleForm = (type, mode, item = null) => {
        setFormModal({
            type,
            mode,
            id: item?.id,
            values: { name: item?.name || '', slug: item?.slug || '' },
        });
    };

    const parentOptions = categories.map((p) => ({ id: p.id, name: p.name }));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="mb-1 gradient-text">Taxonomy Management</h5>
                    <p className="small mb-0" style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>Categories (parent → children), modalities, and body parts used when publishing models.</p>
                </div>
                <button type="button" className="btn-glass-outline"  onClick={reload} disabled={loading}>
                    Refresh
                </button>
            </div>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'categories')} className="mb-3">
                <Tab eventKey="categories" title="Categories">
                    <div className="d-flex justify-content-end mb-2 mt-2">
                        <button type="button"  className="btn-glass-outline" onClick={() => openCategoryForm('create')}>Add parent group</button>
                    </div>
                    <Table bordered hover responsive  variant="dark" className="mt-3">
                        <thead>
                            <tr>
                                <th>Name / slug</th>
                                <th>Type</th>
                                <th>Usage</th>
                                <th>Icon</th>
                                <th style={{ width: 220 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-4" style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>No categories yet. Add a parent group or run taxonomy seeding.</td></tr>
                            )}
                            {categories.map((parent) => (
                                <React.Fragment key={parent.id}>
                                    <tr>
                                        <td>
                                            <strong style={{ color: 'var(--on-surface)' }}>{parent.name}</strong>
                                            <div className="small" style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>{parent.slug}</div>
                                        </td>
                                        <td>Parent group</td>
                                        <td>{parent._count?.children || 0} sub · {parent._count?.models || 0} models</td>
                                        <td>
                                            {parent.svg ? (
                                                <img src={`${FILES_BASE_API_URL}${parent.svg}`} alt="" height={28} />
                                            ) : '—'}
                                        </td>
                                        <td>
                                            <button type="button"  className="btn-glass-primary me-1" onClick={() => openCategoryForm('edit', parent)}>Edit</button>
                                            <button type="button"  className="btn-glass-outline me-1" onClick={() => openCategoryForm('create', null, parent.id)}>Add child</button>
                                            <button type="button"  className="btn-glass-danger" onClick={() => openDelete('category', parent)}>Delete</button>
                                        </td>
                                    </tr>
                                    {(parent.children || []).map((child) => (
                                        <tr key={child.id}>
                                            <td className="ps-4" style={{ color: 'var(--on-surface)' }}>↳ {child.name}<div className="small" style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>{child.slug}</div></td>
                                            <td>Subcategory</td>
                                            <td>{child._count?.models || 0} models</td>
                                            <td>—</td>
                                            <td>
                                                <button type="button"  className="btn-glass-primary me-1" onClick={() => openCategoryForm('edit', { ...child, parentId: parent.id })}>Edit</button>
                                                <button type="button"  className="btn-glass-danger" onClick={() => openDelete('category', child)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="modalities" title="Modalities">
                    <div className="d-flex justify-content-end mb-2 mt-2">
                        <button type="button"  className="btn-glass-outline" onClick={() => openSimpleForm('modality', 'create')}>Add modality</button>
                    </div>
                    <SimpleTaxonomyTable
                        rows={modalities}
                        countKey="versions"
                        onEdit={(row) => openSimpleForm('modality', 'edit', row)}
                        onDelete={(row) => openDelete('modality', row)}
                    />
                </Tab>

                <Tab eventKey="bodyparts" title="Body parts">
                    <div className="d-flex justify-content-end mb-2 mt-2">
                        <button type="button"  className="btn-glass-outline" onClick={() => openSimpleForm('bodypart', 'create')}>Add body part</button>
                    </div>
                    <SimpleTaxonomyTable
                        rows={bodyParts}
                        countKey="versions"
                        onEdit={(row) => openSimpleForm('bodypart', 'edit', row)}
                        onDelete={(row) => openDelete('bodypart', row)}
                    />
                </Tab>
            </Tabs>

            {formModal && (
                <Modal onClose={() => setFormModal(null)}>
                    <Form onSubmit={submitForm} className="glass-container p-4">
                        <h5 className="mb-3 gradient-text">{formModal.mode === 'create' ? 'Create' : 'Edit'} {formModal.type}</h5>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'var(--on-surface)' }}>Name</Form.Label>
                            <Form.Control
                                value={formModal.values.name}
                                required
                                style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormModal((prev) => ({
                                        ...prev,
                                        values: {
                                            ...prev.values,
                                            name,
                                            slug: prev.mode === 'create' ? slugify(name) : prev.values.slug,
                                        },
                                    }));
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: 'var(--on-surface)' }}>Slug</Form.Label>
                            <Form.Control
                                value={formModal.values.slug}
                                required
                                style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                onChange={(e) => setFormModal((prev) => ({ ...prev, values: { ...prev.values, slug: slugify(e.target.value) } }))}
                            />
                        </Form.Group>

                        {formModal.type === 'category' && (
                            <>
                                {!formModal.values.isParent && (
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--on-surface)' }}>Parent group</Form.Label>
                                        <Form.Select
                                            value={formModal.values.parentId || ''}
                                            required
                                            style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                            onChange={(e) => setFormModal((prev) => ({ ...prev, values: { ...prev.values, parentId: e.target.value } }))}
                                        >
                                            <option value="">Select parent…</option>
                                            {parentOptions.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'var(--on-surface)' }}>Icon (optional, parent groups only)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                        onChange={(e) => setFormModal((prev) => ({ ...prev, iconFile: e.target.files?.[0] || null }))}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                            <button type="button" className="btn-glass-outline" onClick={() => setFormModal(null)}>Cancel</button>
                            <button type="submit" className="btn-glass-primary">Save</button>
                        </div>
                    </Form>
                </Modal>
            )}

            {deleteModal && (
                <Modal onClose={() => setDeleteModal(null)}>
                    <div className="glass-container p-4">
                        <h5 className="mb-3 gradient-text">Delete {deleteModal.item.name}?</h5>
                        {deleteModal.type === 'category' && (
                            <>
                                {deleteModal.impact.childCount > 0 && (
                                    <Alert variant="warning">
                                        {deleteModal.impact.childCount} subcategor{deleteModal.impact.childCount === 1 ? 'y' : 'ies'} belong to this parent. Reassign them to another parent group or make them top-level.
                                    </Alert>
                                )}
                                {deleteModal.impact.modelCount > 0 && (
                                    <Alert variant="warning">
                                        {deleteModal.impact.modelCount} model(s) use this category. Reassign them to another subcategory.
                                    </Alert>
                                )}
                                {deleteModal.impact.childCount > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--on-surface)' }}>Reassign subcategories to</Form.Label>
                                        <Form.Select
                                            value={deleteModal.reassignChildrenTo}
                                            style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                            onChange={(e) => setDeleteModal((prev) => ({ ...prev, reassignChildrenTo: e.target.value }))}
                                        >
                                            <option value="">Choose…</option>
                                            <option value="__top__">Make top-level groups (not recommended)</option>
                                            {(deleteModal.impact.reassignOptions?.parentGroups || []).map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                                {deleteModal.impact.modelCount > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'var(--on-surface)' }}>Reassign models to</Form.Label>
                                        <Form.Select
                                            value={deleteModal.reassignModelsTo}
                                            style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                            onChange={(e) => setDeleteModal((prev) => ({ ...prev, reassignModelsTo: e.target.value }))}
                                        >
                                            <option value="">Choose subcategory…</option>
                                            {(deleteModal.impact.reassignOptions?.subcategories || []).map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}
                            </>
                        )}
                        {(deleteModal.type === 'modality' || deleteModal.type === 'bodypart') && deleteModal.impact.versionCount > 0 && (
                            <>
                                <Alert variant="warning">
                                    {deleteModal.impact.versionCount} model version(s) use this entry. Pick a replacement.
                                </Alert>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: 'var(--on-surface)' }}>Reassign versions to</Form.Label>
                                    <Form.Select
                                        value={deleteModal.reassignVersionsTo}
                                        style={{ background: 'var(--surface-light)', color: 'white', border: '1px solid var(--border-color)' }}
                                        onChange={(e) => setDeleteModal((prev) => ({ ...prev, reassignVersionsTo: e.target.value }))}
                                    >
                                        <option value="">Choose…</option>
                                        {(deleteModal.type === 'modality'
                                            ? deleteModal.impact.reassignOptions?.modalities
                                            : deleteModal.impact.reassignOptions?.bodyParts
                                        )?.map((row) => (
                                            <option key={row.id} value={row.id}>{row.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}
                        {(deleteModal.impact.childCount === 0 && deleteModal.impact.modelCount === 0 && deleteModal.impact.versionCount === 0) && (
                            <p style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>Nothing is linked to this entry. Safe to delete.</p>
                        )}
                        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                            <button type="button" className="btn-glass-outline" onClick={() => setDeleteModal(null)}>Cancel</button>
                            <button type="button" variant="danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function SimpleTaxonomyTable({ rows, countKey, onEdit, onDelete }) {
    return (
        <Table bordered hover responsive  variant="dark" className="mt-3">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Versions</th>
                    <th style={{ width: 160 }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4" style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>No entries yet.</td></tr>
                )}
                {rows.map((row) => (
                    <tr key={row.id}>
                        <td>{row.name}</td>
                        <td style={{ color: 'var(--on-surface-muted, #a0aec0)' }}>{row.slug}</td>
                        <td>{row._count?.[countKey] || 0}</td>
                        <td>
                            <button type="button"  className="btn-glass-primary me-1" onClick={() => onEdit(row)}>Edit</button>
                            <button type="button"  className="btn-glass-danger" onClick={() => onDelete(row)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default AdminTaxonomySection;
