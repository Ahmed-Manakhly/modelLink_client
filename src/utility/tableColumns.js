
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
            field: "cover", headerName: "Cover", minWidth: 150,
            renderCell: (params) => {
                const img = params?.row?.cover || params?.row?.galleryImages?.[0];
                const src = img ? (img.startsWith('http') ? img : FILES_BASE_API_URL + img) : '/assets/imgHolder.jpg';
                return <img src={src} alt="cover" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />;
            }
        },
        { field: "title", headerName: "Model Name", minWidth: 350 },
        {
            field: "category", headerName: "Category", minWidth: 350, cellClassName: "name-column--cell",
            valueGetter: (value, row) => row?.categoryRel?.name || row?.category || '—'
        },
        {
            field: "modality", headerName: "Modality", minWidth: 300,
            valueGetter: (value, row) => {
                const primaryVersion = row?.versions?.find(v => v.isPrimary) || row?.versions?.[0];
                return primaryVersion?.modalityRel?.name || primaryVersion?.modality || '—';
            }
        },
        {
            field: "status", headerName: "Status", minWidth: 350,
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
            field: "price", headerName: "Price ($)", minWidth: 150,
            valueGetter: (value, row) => {
                const primaryVersion = row?.versions?.find(v => v.isPrimary) || row?.versions?.[0];
                return primaryVersion?.price || 0;
            }
        },
        { field: "sales", headerName: "Sales", minWidth: 150 },
        { field: "views", headerName: "Views", minWidth: 150 },
        { field: "reviewCount", headerName: "Reviews", minWidth: 150 },
        {
            field: "avgRating", headerName: "Avg Rating", minWidth: 150,
            valueGetter: (value, row) => {
                if (row?.avgRating > 0) return Number(row.avgRating).toFixed(1);
                if (row?.reviewCount > 0 && row?.totalStars > 0) {
                    return (row.totalStars / row.reviewCount).toFixed(1);
                }
                return '—';
            }
        },
        {
            field: "createdAt", headerName: "Created At", minWidth: 300,
            renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString('en-US')}</p>
        },
        {
            field: "actions", headerName: "Actions", minWidth: 250,
            renderCell: (params) => (
                <Box width="100%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
                    {params?.row?.deletedAt && isAdmin ? (
                        <div onClick={() => handleStatusChange(params?.row?.id, 'DRAFT', true)}>
                            <RestoreFromTrashIcon style={{ color: 'var(--color-success)', cursor: 'pointer' }} title="Restore Model" />
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
            field: "developer", headerName: "Created By", minWidth: 350,
            valueGetter: (value, row) => row?.developer?.email || 'Unknown'
        });
        cols.splice(cols.length - 1, 0, {
            field: "updatedAt", headerName: "Updated At", minWidth: 300,
            renderCell: (params) => <p>{params?.row?.updatedAt ? new Date(params.row.updatedAt).toLocaleDateString('en-US') : '—'}</p>
        });
        if (handleFeaturedChange) {
            cols.splice(7, 0, {
                field: "featured", headerName: "Featured", minWidth: 250,
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
        field: "cover", headerName: "Cover", minWidth: 150,
        renderCell: (params) => {
            const img = params?.row?.img || params?.row?.AiModel?.galleryImages?.[0];
            const src = img ? (img.startsWith('http') ? img : FILES_BASE_API_URL + img) : '/assets/imgHolder.jpg';
            return <img src={src} alt="cover" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />;
        }
    },
    { field: "title", headerName: "Model", minWidth: 350 },
    {
        field: "version", headerName: "Version", minWidth: 200,
        valueGetter: (value, row) => row?.AiModelVersion?.version || row?.versionData?.version || '—'
    },
    { field: "purchasePrice", headerName: "Amount ($)", minWidth: 150 },
    {
        field: "client", headerName: "Client", minWidth: 350,
        valueGetter: (value, row) => row?.User_Order_clientIdToUser?.email || row?.clientId || '—'
    },
    {
        field: "createdAt", headerName: "Created At", minWidth: 300,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString('en-US')}</p>
    },
    {
        field: "status", headerName: "Order Status", minWidth: 350, cellClassName: "name-column--cell",
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
        field: "view", headerName: "View Order", minWidth: 250,
        renderCell: (params) => (
            <Link to={"/order/view/" + params?.row?.id} style={{ textDecoration: "none" }}>
                <VisibilityOutlinedIcon className="table-action-icon view" titleAccess="view order" />
            </Link>
        )
    },
    {
        field: "viewModel", headerName: "View Model", minWidth: 250,
        renderCell: (params) => (
            <Link to={"/models/view/" + params?.row?.aiModelId} style={{ textDecoration: "none" }}>
                <VisibilityOutlinedIcon className="table-action-icon view" titleAccess="view model" />
            </Link>
        )
    }
];

const statusBadge = (status, colorMap = {}) => {
    const bg = colorMap[status] || 'secondary';
    return <Chip label={status} size="small" sx={{ fontSize: '0.7rem' }} color={bg === 'secondary' ? 'default' : undefined} style={typeof bg === 'string' && !['default', 'primary', 'secondary'].includes(bg) ? { backgroundColor: bg, color: ['var(--color-success)', 'var(--color-warning)', 'var(--primary)', 'var(--color-info, #6f42c1)'].includes(bg) ? 'var(--bg-main)' : '#fff' } : undefined} />;
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
        field: 'customId', headerName: 'Member ID', minWidth: 120,
        valueGetter: (value, row) => row?.customId || '—'
    },
    { field: 'org_username', headerName: 'Username', minWidth: 180 },
    { field: 'email', headerName: 'Email', minWidth: 250 },
    {
        field: 'role', headerName: 'Role', minWidth: 150,
        renderCell: (params) => statusBadge(params?.row?.role, { ADMIN: 'var(--color-secondary, #6c757d)', DEVELOPER: 'var(--primary)', CLIENT: 'var(--color-success)', EMPLOYEE: 'var(--color-info, #6f42c1)' })
    },
    {
        field: 'isActive', headerName: 'Status', minWidth: 120,
        renderCell: (params) => params?.row?.isActive
            ? <Chip label="Active" size="small" sx={{ backgroundColor: 'var(--color-success)', color: 'var(--bg-main)', fontSize: '0.7rem' }} />
            : <Chip label="Suspended" size="small" sx={{ backgroundColor: 'var(--color-danger)', color: '#fff', fontSize: '0.7rem' }} />
    },
    {
        field: 'walletBalance', headerName: 'Available Balance', minWidth: 150,
        valueGetter: (value, row) => {
            if (row?.role !== 'DEVELOPER') return '—';
            const balance = row?.wallet?.availableBalance;
            return balance != null ? `$${Number(balance).toFixed(2)}` : '—';
        }
    },
    {
        field: 'lastLogin', headerName: 'Last Login', minWidth: 150,
        renderCell: (params) => {
            const lastLogin = params?.row?.lastLogin;
            return <span>{lastLogin ? new Date(lastLogin).toLocaleDateString('en-US') : 'Never'}</span>;
        }
    },
    {
        field: 'actions', headerName: 'Actions', minWidth: 180,
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
        field: 'developer', headerName: 'Developer', minWidth: 200,
        valueGetter: (value, row) => row?.user?.org_username || row?.userId || '—'
    },
    {
        field: 'amount', headerName: 'Amount', minWidth: 120,
        renderCell: (params) => <span style={{ fontWeight: 700 }}>${Number(params?.row?.amount || 0).toFixed(2)}</span>
    },
    {
        field: 'createdAt', headerName: 'Date', minWidth: 150,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'status', headerName: 'Status', minWidth: 120,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { PAID: 'var(--color-success)', PENDING: 'var(--color-warning)', REJECTED: 'var(--color-danger)' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || 'var(--color-secondary, #6c757d)', color: (status === 'PENDING' || status === 'PAID') ? 'var(--bg-main)' : '#fff', fontSize: '0.7rem', fontWeight: 600 }} />;
        }
    },
    {
        field: 'note', headerName: 'Notes', minWidth: 200,
        valueGetter: (value, row) => {
            const parts = [row?.note, row?.adminNote].filter(Boolean);
            return parts.length ? parts.join(' · ') : '—';
        }
    },
    {
        field: 'actions', headerName: 'Actions', minWidth: 320,
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
        field: 'orderTitle', headerName: 'Order Title', minWidth: 200,
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
    { field: 'reason', headerName: 'Dispute Reason', minWidth: 250 },
    {
        field: 'openedBy', headerName: 'Opened By', minWidth: 150,
        valueGetter: (value, row) => row?.openedBy?.org_username || row?.openedBy?.email || '—'
    },
    {
        field: 'createdAt', headerName: 'Date Opened', minWidth: 150,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'status', headerName: 'Status', minWidth: 120,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { OPEN: 'var(--color-danger)', UNDER_REVIEW: 'var(--color-warning)', RESOLVED: 'var(--color-success)', REJECTED: 'var(--color-secondary, #6c757d)' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || 'var(--color-secondary, #6c757d)', color: (status === 'UNDER_REVIEW' || status === 'RESOLVED') ? 'var(--bg-main)' : '#fff', fontSize: '0.7rem' }} />;
        }
    },
    {
        field: 'actions', headerName: 'Actions', minWidth: 400,
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
        field: 'developer', headerName: 'Developer', minWidth: 350,
        renderCell: (params) => (
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <UserProfileStrip user={params?.row?.user} variant="public" infoOnly />
            </div>
        )
    },
    {
        field: 'documentUrl', headerName: 'Document', minWidth: 150,
        renderCell: (params) => params?.row?.documentUrl ? (
            <a href={FILES_BASE_API_URL + params.row.documentUrl} target="_blank" rel="noreferrer" className="btn-glass-outline py-1 px-3" style={{fontSize: '0.8rem'}}>View Document</a>
        ) : <span className="text-muted">No document</span>
    },
    {
        field: 'notes', headerName: 'Notes', minWidth: 220,
        renderCell: (params) => <TruncatedNotes text={params?.row?.notes} />
    },
    {
        field: 'createdAt', headerName: 'Submitted', minWidth: 120,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'verifiedAt', headerName: 'Verified At', minWidth: 120,
        renderCell: (params) => {
            const verifiedAt = params?.row?.verifiedAt;
            if (params?.row?.status === 'APPROVED' && verifiedAt) {
                return <p>{new Date(verifiedAt).toLocaleDateString()}</p>;
            }
            return <span className="text-muted">—</span>;
        }
    },
    {
        field: 'status', headerName: 'Status', minWidth: 100,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { APPROVED: 'var(--color-success)', PENDING: 'var(--color-warning)', REJECTED: 'var(--color-danger)' };
            return <Chip label={status} size="small" sx={{ backgroundColor: colors[status] || 'var(--color-secondary, #6c757d)', color: (status === 'PENDING' || status === 'APPROVED') ? 'var(--bg-main)' : '#fff', fontSize: '0.7rem', fontWeight: 600 }} />;
        }
    },
    {
        field: 'actions', headerName: 'Actions', minWidth: 320,
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
        field: 'createdAt', headerName: 'Date', minWidth: 150,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'orderTitle', headerName: 'Order Title', minWidth: 250,
        valueGetter: (value, row) => row?.order?.title || `Order #${row?.orderId}`
    },
    {
        field: 'grossAmount', headerName: 'Gross Amount', minWidth: 150,
        renderCell: (params) => <span>${Number(params?.row?.grossAmount || 0).toFixed(2)}</span>
    },
    {
        field: 'platformFee', headerName: 'Platform Fee', minWidth: 150,
        renderCell: (params) => <span>${Number(params?.row?.platformFee || 0).toFixed(2)}</span>
    },
    {
        field: 'developerPayout', headerName: 'Developer Payout', minWidth: 150,
        renderCell: (params) => <span>${Number(params?.row?.developerPayout || 0).toFixed(2)}</span>
    }
];

export const getAdminAuditLogColumns = () => [
    {
        field: 'createdAt', headerName: 'Date', minWidth: 150,
        renderCell: (params) => <p>{new Date(params?.row?.createdAt).toLocaleDateString()}</p>
    },
    {
        field: 'admin', headerName: 'Admin', minWidth: 200,
        valueGetter: (value, row) => row?.Admin?.org_username || row?.adminId || 'N/A'
    },
    {
        field: 'actionType', headerName: 'Action', minWidth: 150,
        renderCell: (params) => <Chip label={params?.row?.actionType} size="small" />
    },
    { field: 'targetId', headerName: 'Target ID', minWidth: 150 },
    { field: 'reason', headerName: 'Reason', minWidth: 300 }
];

export const getAdminWebhookColumns = () => [
    {
        field: 'receivedAt', headerName: 'Received', minWidth: 150,
        renderCell: (params) => <p>{params?.row?.receivedAt ? new Date(params.row.receivedAt).toLocaleString() : '—'}</p>
    },
    { field: 'eventType', headerName: 'Event Type', minWidth: 200 },
    { field: 'provider', headerName: 'Provider', minWidth: 100 },
    {
        field: 'status', headerName: 'Status', minWidth: 120,
        renderCell: (params) => <Chip label={params?.row?.status} size="small" />
    },
    {
        field: 'failureReason', headerName: 'Failure', minWidth: 250,
        valueGetter: (value, row) => {
            const reason = row?.failureReason;
            if (!reason) return '—';
            return reason.length > 80 ? `${reason.slice(0, 80)}…` : reason;
        }
    },
    {
        field: 'processedAt', headerName: 'Processed', minWidth: 150,
        renderCell: (params) => <p>{params?.row?.processedAt ? new Date(params.row.processedAt).toLocaleString() : '—'}</p>
    },
];

export const getClientReviewColumns = () => [
    {
        field: 'AiModel', headerName: 'Model', minWidth: 250,
        renderCell: (params) => (
            <Link to={`/models/view/${params?.row?.aiModelId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
                {params?.row?.AiModel?.title || `Model #${params?.row?.aiModelId}`}
            </Link>
        ),
    },
    {
        field: 'star', headerName: 'Rating', minWidth: 150,
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
        field: 'desc', headerName: 'Review', minWidth: 350,
        valueGetter: (value, row) => row?.desc?.length > 80 ? `${row.desc.slice(0, 80)}…` : row?.desc,
    },
    {
        field: 'createdAt', headerName: 'Date', minWidth: 150,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'orderId', headerName: 'Order', minWidth: 150,
        renderCell: (params) => (
            <Link to={`/order/view/${params?.row?.orderId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>#{params?.row?.orderId}</Link>
        ),
    },
];

export const getDeveloperReviewColumns = () => [
    {
        field: 'AiModel', headerName: 'Model', minWidth: 200,
        renderCell: (params) => (
            <Link to={`/models/view/${params?.row?.aiModelId}`} style={{ textDecoration: 'none', color: 'var(--primary)' }}>
                {params?.row?.AiModel?.title || `Model #${params?.row?.aiModelId}`}
            </Link>
        ),
    },
    {
        field: 'User', headerName: 'Client', minWidth: 350,
        renderCell: (params) => (
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <UserProfileStrip user={params?.row?.User} variant="public" infoOnly />
            </div>
        )
    },
    {
        field: 'star', headerName: 'Rating', minWidth: 150,
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
        field: 'desc', headerName: 'Review', minWidth: 350,
        valueGetter: (value, row) => row?.desc?.length > 80 ? `${row.desc.slice(0, 80)}…` : row?.desc,
    },
    {
        field: 'createdAt', headerName: 'Date', minWidth: 150,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
];

export const getWalletTransactionColumns = () => [
    {
        field: 'createdAt', headerName: 'Date', minWidth: 200,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'type', headerName: 'Type', minWidth: 150,
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
        field: 'amount', headerName: 'Amount', minWidth: 150,
        renderCell: (params) => (
            <span style={{ 
                color: params?.row?.type === 'SALE' ? 'var(--color-success)' : 'var(--color-error)',
                fontWeight: 600
            }}>
                {params?.row?.type === 'SALE' ? '+' : '-'}${Number(params?.row?.amount || 0).toFixed(2)}
            </span>
        ),
    },
    { field: 'description', headerName: 'Description', minWidth: 350 },
];

export const getMyPayoutColumns = (onCancel) => [
    {
        field: 'createdAt', headerName: 'Date', minWidth: 200,
        renderCell: (params) => <span>{new Date(params?.row?.createdAt).toLocaleDateString()}</span>,
    },
    {
        field: 'amount', headerName: 'Amount', minWidth: 150,
        renderCell: (params) => <span className="text-success">${Number(params?.row?.amount || 0).toFixed(2)}</span>,
    },
    {
        field: 'status', headerName: 'Status', minWidth: 150,
        renderCell: (params) => {
            const status = params?.row?.status;
            const colors = { PAID: 'var(--color-success)', PENDING: 'var(--color-warning)', REJECTED: 'var(--color-danger)' };
            return (
                <Chip
                    label={status}
                    size="small"
                    sx={{
                        backgroundColor: colors[status] || 'var(--color-secondary, #6c757d)',
                        color: (status === 'PENDING' || status === 'PAID') ? 'var(--bg-main)' : '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 600
                    }}
                />
            );
        },
    },
    {
        field: 'note', headerName: 'Notes', minWidth: 300,
        valueGetter: (value, row) => {
            const parts = [];
            if (row?.note) parts.push(`You: ${row.note}`);
            if (row?.adminNote) parts.push(`Admin: ${row.adminNote}`);
            return parts.length ? parts.join(' · ') : '—';
        },
    },
    {
        field: 'actions', headerName: 'Action', minWidth: 200,
        renderCell: (params) => (
            params?.row?.status === 'PENDING' ? (
                <button className="btn-glass-danger py-1 px-3" style={{ fontSize: '0.8rem' }} onClick={() => onCancel(params.row.id)}>
                    Cancel
                </button>
            ) : null
        ),
    },
];
