
import React, { useState } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';
import { FILES_BASE_API_URL } from '../lib/api';
import { Box, Chip } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { Link } from "react-router-dom";
import UserProfileStrip from '../components/UserProfileStrip';
import { FaRegFaceAngry, FaRegFaceFrown, FaRegFaceMeh, FaRegFaceSmile, FaRegFaceLaughBeam } from "react-icons/fa6";

export const getModelColumns = (handleDelete, handleStatusChange, isAdmin = false, handleFeaturedChange = null) => {
    const cols = [

        {
            field: "cover", headerName: "Cover", flex: 0.15,
            renderCell: (params) => {
                const img = params?.row?.cover || params?.row?.galleryImages?.[0];
                const src = img ? (img.startsWith('http') ? img : FILES_BASE_API_URL + img) : '/assets/imgHolder.jpg';
                return <img src={src} alt="cover" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />;
            }
        },
        { field: "title", headerName: "Model Name", flex: 0.40 },
        {
            field: "category", headerName: "Category", flex: 0.35, cellClassName: "name-column--cell",
            valueGetter: (value, row) => row?.categoryRel?.name || '—'
        },
        {
            field: "modality", headerName: "Modality", flex: 0.30,
            valueGetter: (value, row) => {
                const primaryVersion = row?.versions?.find(v => v.isPrimary) || row?.versions?.[0];
                return primaryVersion?.modalityRel?.name || primaryVersion?.modality || '—';
            }
        },
        {
            field: "status", headerName: "Status", flex: 0.40,
            renderCell: (params) => {
                let color = 'var(--bg-main, #000)';
                let bg = 'var(--color-danger, #e74c3c)'; // Red for draft
                if (params?.row?.status === 'PUBLISHED') bg = 'var(--color-success, #2ecc71)'; // Green for published
                if (params?.row?.status === 'ARCHIVED' || params?.row?.deletedAt) bg = 'gray';

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Chip
                            label={params?.row?.deletedAt ? 'SOFT DELETED' : params?.row?.status}
                            size="small"
                            sx={{ backgroundColor: bg, color, fontSize: '0.7rem', fontWeight: 'bold', minWidth: '95px' }}
                        />
                        {handleStatusChange && !params?.row?.deletedAt && (
                            <ToggleSwitch
                                id={`model-switch-${params?.row?.id}`}
                                type="checkbox"
                                checked={params?.row?.status === 'PUBLISHED'}
                                onChange={() => handleStatusChange(params?.row?.id, params?.row?.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                            />
                        )}
                    </div>
                );
            }
        },
        {
            field: "price", headerName: "Price ($)", flex: 0.15,
            valueGetter: (value, row) => {
                const primaryVersion = row?.versions?.find(v => v.isPrimary) || row?.versions?.[0];
                return primaryVersion?.price || 0;
            }
        },
        { field: "sales", headerName: "Sales", flex: 0.15 },
        { field: "views", headerName: "Views", flex: 0.15 },
        { field: "reviewCount", headerName: "Reviews", flex: 0.15 },
        {
            field: "avgRating", headerName: "Avg Rating", flex: 0.15,
            valueGetter: (value, row) => {
                if (row?.avgRating > 0) return Number(row.avgRating).toFixed(1);
                if (row?.reviewCount > 0 && row?.totalStars > 0) {
                    return (row.totalStars / row.reviewCount).toFixed(1);
                }
                return '—';
            }
        },
        {
            field: "createdAt", headerName: "Created At", flex: 0.30,
            renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString('en-US')}</p>
        },
        {
            field: "actions", headerName: "Actions", flex: 0.25,
            renderCell: (params) => (
                <Box width="100%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
                    {params?.row?.deletedAt && isAdmin ? (
                        <div onClick={() => handleStatusChange(params?.row?.id, 'DRAFT', true)}>
                            <RestoreFromTrashIcon style={{ color: '#2ecc71', cursor: 'pointer' }} title="Restore Model" />
                        </div>
                    ) : (
                        <>
                            <Link to={"/models/view/" + params?.row?.id} style={{ textDecoration: "none" }}>
                                <VisibilityOutlinedIcon className="table-action-icon view" titleAccess="view" />
                            </Link>
                            <Link to={"/models/edit/" + params?.row?.id} style={{ textDecoration: "none" }}>
                                <EditOutlinedIcon className="table-action-icon edit" titleAccess="edit" />
                            </Link>
                            <div onClick={() => handleDelete(params?.row?.id)}>
                                <DeleteOutlineIcon className="table-action-icon delete" titleAccess="delete" />
                            </div>
                        </>
                    )}
                </Box>
            )
        }
    ];

    if (isAdmin) {
        cols.splice(2, 0, {
            field: "developer", headerName: "Created By", flex: 0.35,
            valueGetter: (value, row) => row?.developer?.email || 'Unknown'
        });
        cols.splice(cols.length - 1, 0, {
            field: "updatedAt", headerName: "Updated At", flex: 0.30,
            renderCell: (params) => <p>{params?.row?.updatedAt ? new Date(params.row.updatedAt).toLocaleDateString('en-US') : '—'}</p>
        });
        if (handleFeaturedChange) {
            cols.splice(7, 0, {
                field: "featured", headerName: "Featured", flex: 0.25,
                renderCell: (params) => (
                    <ToggleSwitch
                        id={`featured-switch-${params?.row?.id}`}
                        type="checkbox"
                        checked={Boolean(params?.row?.featured)}
                        onChange={() => handleFeaturedChange(params?.row?.id, !params?.row?.featured)}
                    />
                )
            });
        }
    }

    return cols;
};

export const getOrderColumns = () => [
    {
        field: "cover", headerName: "Cover", flex: 0.15,
        renderCell: (params) => {
            const img = params?.row?.img || params?.row?.AiModel?.galleryImages?.[0];
            const src = img ? (img.startsWith('http') ? img : FILES_BASE_API_URL + img) : '/assets/imgHolder.jpg';
            return <img src={src} alt="cover" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />;
        }
    },
    { field: "title", headerName: "Model", flex: 0.40 },
    {
        field: "version", headerName: "Version", flex: 0.20,
        valueGetter: (value, row) => row?.AiModelVersion?.version || row?.versionData?.version || '—'
    },
    { field: "purchasePrice", headerName: "Amount ($)", flex: 0.15 },
    {
        field: "client", headerName: "Client", flex: 0.35,
        valueGetter: (value, row) => row?.User_Order_clientIdToUser?.email || row?.clientId || '—'
    },
    {
        field: "createdAt", headerName: "Created At", flex: 0.30,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString('en-US')}</p>
    },
    {
        field: "status", headerName: "Order Status", flex: 0.40, cellClassName: "name-column--cell",
        renderCell: (params) => {
            const status = params?.row?.status || (params?.row?.isCompleted ? 'PAID' : 'PENDING');
            const disputeStatus = params?.row?.dispute?.status;
            let color = 'var(--color-warning, #FFC107)';
            if (status === 'PAID' || status === 'DELIVERED') color = 'var(--color-success, #10B981)';
            if (status === 'CANCELLED' || status === 'REFUNDED') color = 'var(--color-danger, #F44336)';
            if (status === 'DISPUTED') color = 'var(--color-danger, #F44336)';
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontWeight: 'bold', color, margin: 0 }}>{status}</p>
                    {disputeStatus && <Chip label={`Dispute: ${disputeStatus}`} size="small" sx={{ fontSize: '0.65rem', width: 'fit-content' }} />}
                </div>
            );
        }
    },
    {
        field: "view", headerName: "View Order", flex: 0.25,
        renderCell: (params) => (
            <Link to={"/order/view/" + params?.row?.id} style={{ textDecoration: "none" }}>
                <VisibilityOutlinedIcon className="table-action-icon view" titleAccess="view order" />
            </Link>
        )
    },
    {
        field: "viewModel", headerName: "View Model", flex: 0.25,
        renderCell: (params) => (
            <Link to={"/models/view/" + params?.row?.aiModelId} style={{ textDecoration: "none" }}>
                <VisibilityOutlinedIcon className="table-action-icon view" titleAccess="view model" />
            </Link>
        )
    }
];

const statusBadge = (status, colorMap = {}) => {
    const bg = colorMap[status] || 'secondary';
    return <Chip label={status} size="small" sx={{ fontSize: '0.7rem' }} color={bg === 'secondary' ? 'default' : undefined} style={typeof bg === 'string' && !['default', 'primary', 'secondary'].includes(bg) ? { backgroundColor: bg, color: '#fff' } : undefined} />;
};

const TruncatedNotes = ({ text, maxLen = 50 }) => {
    const [expanded, setExpanded] = useState(false);
    if (!text) return <span className="text-muted">—</span>;
    if (text.length <= maxLen) return <span>{text}</span>;
    return (
        <span>
            {expanded ? text : `${text.slice(0, maxLen)}…`}
            {' '}
            <button
                type="button"
                className="btn btn-link btn-sm p-0 align-baseline"
                onClick={() => setExpanded((prev) => !prev)}
            >
                {expanded ? 'Less' : 'More'}
            </button>
        </span>
    );
};

export const getAdminUserColumns = (handleSuspend, handleReactivate) => [
    {
        field: 'customId', headerName: 'Member ID', flex: 0.12,
        valueGetter: (value, row) => row?.customId || '—'
    },
    { field: 'org_username', headerName: 'Username', flex: 0.18 },
    { field: 'email', headerName: 'Email', flex: 0.25 },
    {
        field: 'role', headerName: 'Role', flex: 0.15,
        renderCell: (params) => statusBadge(params?.row?.role, { ADMIN: '#6c757d', DEVELOPER: '#0d6efd', CLIENT: '#198754', EMPLOYEE: '#6f42c1' })
    },
    {
        field: 'isActive', headerName: 'Status', flex: 0.12,
        renderCell: (params) => params?.row?.isActive
            ? <Chip label="Active" size="small" sx={{ backgroundColor: '#2ecc71', color: '#fff', fontSize: '0.7rem' }} />
            : <Chip label="Suspended" size="small" sx={{ backgroundColor: '#e74c3c', color: '#fff', fontSize: '0.7rem' }} />
    },
    {
        field: 'walletBalance', headerName: 'Available Balance', flex: 0.15,
        valueGetter: (value, row) => {
            if (row?.role !== 'DEVELOPER') return '—';
            const balance = row?.wallet?.availableBalance;
            return balance != null ? `$${Number(balance).toFixed(2)}` : '—';
        }
    },
    {
        field: 'lastLogin', headerName: 'Last Login', flex: 0.15,
        renderCell: (params) => {
            const lastLogin = params?.row?.lastLogin;
            return <span>{lastLogin ? new Date(lastLogin).toLocaleDateString('en-US') : 'Never'}</span>;
        }
    },
    {
        field: 'actions', headerName: 'Actions', flex: 0.18,
        renderCell: (params) => (
            params?.row?.isActive ? (
                <button className="btn-glass-danger py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleSuspend(params.row.id)}>Suspend</button>
            ) : (
                <button className="btn-glass-primary py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleReactivate(params.row.id)}>Reactivate</button>
            )
        )
    }
];

export const getAdminPayoutColumns = (handleApprove, handleReject) => [
    {
        field: 'developer', headerName: 'Developer', flex: 0.2,
        valueGetter: (value, row) => row?.user?.org_username || row?.userId || '—'
    },
    {
        field: 'amount', headerName: 'Amount', flex: 0.12,
        renderCell: (params) => <span style={{ fontWeight: 700 }}>${Number(params?.row?.amount || 0).toFixed(2)}</span>
    },
    {
        field: 'createdAt', headerName: 'Date', flex: 0.15,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'status', headerName: 'Status', flex: 0.12,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { PAID: '#2ecc71', PENDING: '#ffc107', REJECTED: '#e74c3c' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || '#6c757d', color: (status === 'PENDING' || status === 'PAID') ? 'var(--bg-main)' : '#fff', fontSize: '0.7rem', fontWeight: 600 }} />;
        }
    },
    {
        field: 'note', headerName: 'Notes', flex: 0.2,
        valueGetter: (value, row) => {
            const parts = [row?.note, row?.adminNote].filter(Boolean);
            return parts.length ? parts.join(' · ') : '—';
        }
    },
    {
        field: 'actions', headerName: 'Actions', flex: 0.2,
        renderCell: (params) => params?.row?.status === 'PENDING' ? (
            <Box display="flex" gap="4px">
                <button className="btn-glass-primary py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleApprove(params.row.id)}>Approve</button>
                <button className="btn-glass-danger py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleReject(params.row.id)}>Reject</button>
            </Box>
        ) : null
    }
];

export const getAdminDisputeColumns = (handleResolve) => [
    {
        field: 'orderTitle', headerName: 'Order Title', flex: 0.2,
        renderCell: (params) => {
            const orderId = params?.row?.orderId ?? params?.row?.order?.id;
            if (!orderId) {
                return params?.row?.order?.title || '—';
            }
            return (
                <Link to={`/order/view/${orderId}`} style={{ textDecoration: 'none', color: '#5DB8DD' }}>
                    {params?.row?.order?.title || `Order #${orderId}`}
                </Link>
            );
        }
    },
    { field: 'reason', headerName: 'Dispute Reason', flex: 0.25 },
    {
        field: 'openedBy', headerName: 'Opened By', flex: 0.15,
        valueGetter: (value, row) => row?.openedBy?.org_username || row?.openedBy?.email || '—'
    },
    {
        field: 'createdAt', headerName: 'Date Opened', flex: 0.15,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'status', headerName: 'Status', flex: 0.12,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { OPEN: '#e74c3c', UNDER_REVIEW: '#f39c12', RESOLVED: '#2ecc71', REJECTED: '#6c757d' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || '#6c757d', color: '#fff', fontSize: '0.7rem' }} />;
        }
    },
    {
        field: 'actions', headerName: 'Actions', flex: 0.25,
        renderCell: (params) => params?.row?.status === 'OPEN' ? (
            <Box display="flex" gap="4px">
                <button className="btn-glass-outline py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleResolve(params.row.id, 'REFUND_CLIENT')}>Refund Buyer</button>
                <button className="btn-glass-primary py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleResolve(params.row.id, 'RELEASE_TO_DEVELOPER')}>Release to Developer</button>
            </Box>
        ) : null
    }
];

export const getAdminVerificationColumns = (handleApprove, handleReject) => [
    {
        field: 'developer', headerName: 'Developer', flex: 0.35,
        renderCell: (params) => (
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <UserProfileStrip user={params?.row?.user} variant="public" infoOnly />
            </div>
        )
    },
    {
        field: 'documentUrl', headerName: 'Document', flex: 0.15,
        renderCell: (params) => params?.row?.documentUrl ? (
            <a href={FILES_BASE_API_URL + params.row.documentUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">View Document</a>
        ) : <span className="text-muted">No document</span>
    },
    {
        field: 'notes', headerName: 'Notes', flex: 0.22,
        renderCell: (params) => <TruncatedNotes text={params?.row?.notes} />
    },
    {
        field: 'createdAt', headerName: 'Submitted', flex: 0.12,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'verifiedAt', headerName: 'Verified At', flex: 0.12,
        renderCell: (params) => {
            const verifiedAt = params?.row?.verifiedAt;
            if (params?.row?.status === 'APPROVED' && verifiedAt) {
                return <p>{new Date(verifiedAt).toLocaleDateString()}</p>;
            }
            return <span className="text-muted">—</span>;
        }
    },
    {
        field: 'status', headerName: 'Status', flex: 0.1,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { APPROVED: '#2ecc71', PENDING: '#ffc107', REJECTED: '#e74c3c' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || '#6c757d', color: (status === 'PENDING' || status === 'APPROVED') ? 'var(--bg-main)' : '#fff', fontSize: '0.7rem', fontWeight: 600 }} />;
        }
    },
    {
        field: 'actions', headerName: 'Actions', flex: 0.2,
        renderCell: (params) => (params?.row?.status === 'PENDING' && params?.row?.documentUrl) ? (
            <Box display="flex" gap="4px">
                <button className="btn-glass-primary py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleApprove(params.row.id)}>Approve</button>
                <button className="btn-glass-danger py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => handleReject(params.row.id)}>Reject</button>
            </Box>
        ) : null
    }
];

export const getAdminTransactionColumns = () => [
    {
        field: 'createdAt', headerName: 'Date', flex: 0.15,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'orderTitle', headerName: 'Order Title', flex: 0.25,
        valueGetter: (value, row) => row?.order?.title || `Order #${row?.orderId}`
    },
    {
        field: 'grossAmount', headerName: 'Gross Amount', flex: 0.15,
        renderCell: (params) => <span>${Number(params?.row?.grossAmount || 0).toFixed(2)}</span>
    },
    {
        field: 'platformFee', headerName: 'Platform Fee', flex: 0.15,
        renderCell: (params) => <span>${Number(params?.row?.platformFee || 0).toFixed(2)}</span>
    },
    {
        field: 'developerPayout', headerName: 'Developer Payout', flex: 0.15,
        renderCell: (params) => <span>${Number(params?.row?.developerPayout || 0).toFixed(2)}</span>
    }
];

export const getAdminAuditLogColumns = () => [
    {
        field: 'createdAt', headerName: 'Date', flex: 0.15,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'admin', headerName: 'Admin', flex: 0.2,
        valueGetter: (value, row) => row?.Admin?.org_username || row?.adminId || 'N/A'
    },
    {
        field: 'actionType', headerName: 'Action', flex: 0.15,
        renderCell: (params) => <Chip label={params?.row?.actionType} size="small" />
    },
    { field: 'targetId', headerName: 'Target ID', flex: 0.15 },
    { field: 'reason', headerName: 'Reason', flex: 0.3 }
];

export const getAdminWebhookColumns = () => [
    {
        field: 'receivedAt', headerName: 'Received', flex: 0.15,
        renderCell: (params) => <p>{params?.row?.receivedAt ? new Date(params.row.receivedAt).toLocaleString() : '—'}</p>
    },
    { field: 'eventType', headerName: 'Event Type', flex: 0.2 },
    { field: 'provider', headerName: 'Provider', flex: 0.1 },
    {
        field: 'status', headerName: 'Status', flex: 0.12,
        renderCell: (params) => <Chip label={params?.row?.status} size="small" />
    },
    {
        field: 'failureReason', headerName: 'Failure', flex: 0.25,
        valueGetter: (value, row) => {
            const reason = row?.failureReason;
            if (!reason) return '—';
            return reason.length > 80 ? `${reason.slice(0, 80)}…` : reason;
        }
    },
    {
        field: 'processedAt', headerName: 'Processed', flex: 0.15,
        renderCell: (params) => <p>{params?.row?.processedAt ? new Date(params.row.processedAt).toLocaleString() : '—'}</p>
    },
];

export const getClientReviewColumns = () => [
    {
        field: 'AiModel', headerName: 'Model', flex: 0.25,
        renderCell: (params) => (
            <Link to={`/models/view/${params?.row?.aiModelId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
                {params?.row?.AiModel?.title || `Model #${params?.row?.aiModelId}`}
            </Link>
        ),
    },
    {
        field: 'star', headerName: 'Rating', flex: 0.15,
        renderCell: (params) => {
            const rating = params?.row?.star || 0;
            if (!rating) return <span>—</span>;
            const labels = [
                { label: "Poor!", color: "var(--color-danger)", icon: <FaRegFaceAngry /> },
                { label: "Bad!", color: "var(--color-warning)", icon: <FaRegFaceFrown /> },
                { label: "Okay!", color: "var(--color-warning)", icon: <FaRegFaceMeh /> },
                { label: "Good!", color: "var(--color-success)", icon: <FaRegFaceSmile /> },
                { label: "Great!", color: "var(--color-success)", icon: <FaRegFaceLaughBeam /> },
            ];
            const data = labels[rating - 1] || labels[0];
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#FFD700' }}>{rating} ★</span>
                    <span style={{ fontWeight: 600, color: data.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {data.label} {data.icon}
                    </span>
                </div>
            );
        },
    },
    {
        field: 'desc', headerName: 'Review', flex: 0.35,
        valueGetter: (value, row) => row?.desc?.length > 80 ? `${row.desc.slice(0, 80)}…` : row?.desc,
    },
    {
        field: 'createdAt', headerName: 'Date', flex: 0.15,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'orderId', headerName: 'Order', flex: 0.15,
        renderCell: (params) => (
            <Link to={`/order/view/${params?.row?.orderId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>#{params?.row?.orderId}</Link>
        ),
    },
];

export const getDeveloperReviewColumns = () => [
    {
        field: 'AiModel', headerName: 'Model', flex: 0.2,
        renderCell: (params) => (
            <Link to={`/models/view/${params?.row?.aiModelId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
                {params?.row?.AiModel?.title || `Model #${params?.row?.aiModelId}`}
            </Link>
        ),
    },
    {
        field: 'User', headerName: 'Client', flex: 0.35,
        renderCell: (params) => (
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <UserProfileStrip user={params?.row?.User} variant="public" infoOnly />
            </div>
        )
    },
    {
        field: 'star', headerName: 'Rating', flex: 0.15,
        renderCell: (params) => {
            const rating = params?.row?.star || 0;
            if (!rating) return <span>—</span>;
            const labels = [
                { label: "Poor!", color: "var(--color-danger)", icon: <FaRegFaceAngry /> },
                { label: "Bad!", color: "var(--color-warning)", icon: <FaRegFaceFrown /> },
                { label: "Okay!", color: "var(--color-warning)", icon: <FaRegFaceMeh /> },
                { label: "Good!", color: "var(--color-success)", icon: <FaRegFaceSmile /> },
                { label: "Great!", color: "var(--color-success)", icon: <FaRegFaceLaughBeam /> },
            ];
            const data = labels[rating - 1] || labels[0];
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#FFD700' }}>{rating} ★</span>
                    <span style={{ fontWeight: 600, color: data.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {data.label} {data.icon}
                    </span>
                </div>
            );
        },
    },
    {
        field: 'desc', headerName: 'Review', flex: 0.35,
        valueGetter: (value, row) => row?.desc?.length > 80 ? `${row.desc.slice(0, 80)}…` : row?.desc,
    },
    {
        field: 'createdAt', headerName: 'Date', flex: 0.15,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
];

export const getWalletTransactionColumns = () => [
    {
        field: 'createdAt', headerName: 'Date', flex: 0.2,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'type', headerName: 'Type', flex: 0.15,
        renderCell: (params) => (
            <Chip
                label={params?.row?.type}
                size="small"
                sx={{
                    backgroundColor: params?.row?.type === 'SALE' ? 'var(--color-success)' : 'var(--primary)',
                    color: 'var(--bg-main, #0b0f19)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                }}
            />
        ),
    },
    {
        field: 'amount', headerName: 'Amount', flex: 0.15,
        renderCell: (params) => (
            <span style={{ 
                color: params?.row?.type === 'SALE' ? 'var(--color-success)' : 'var(--color-error)',
                fontWeight: 600
            }}>
                {params?.row?.type === 'SALE' ? '+' : '-'}${Number(params?.row?.amount || 0).toFixed(2)}
            </span>
        ),
    },
    { field: 'description', headerName: 'Description', flex: 0.5 },
];

export const getMyPayoutColumns = (onCancel) => [
    {
        field: 'createdAt', headerName: 'Date', flex: 0.2,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'amount', headerName: 'Amount', flex: 0.15,
        renderCell: (params) => <span className="text-success">${Number(params?.row?.amount || 0).toFixed(2)}</span>,
    },
    {
        field: 'status', headerName: 'Status', flex: 0.15,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { PAID: '#2ecc71', PENDING: '#ffc107', REJECTED: '#e74c3c' };
            return (
                <Chip
                    label={status}
                    size="small"
                    sx={{
                        backgroundColor: colors[status] || '#6c757d',
                        color: (status === 'PENDING' || status === 'PAID') ? 'var(--bg-main)' : '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 600
                    }}
                />
            );
        },
    },
    {
        field: 'note', headerName: 'Notes', flex: 0.3,
        valueGetter: (value, row) => {
            const parts = [];
            if (row?.note) parts.push(`You: ${row.note}`);
            if (row?.adminNote) parts.push(`Admin: ${row.adminNote}`);
            return parts.length ? parts.join(' · ') : '—';
        },
    },
    {
        field: 'actions', headerName: 'Action', flex: 0.2,
        renderCell: (params) => (
            params?.row?.status === 'PENDING' ? (
                <button className="btn-glass-danger py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => onCancel(params.row.id)}>
                    Cancel
                </button>
            ) : null
        ),
    },
];
