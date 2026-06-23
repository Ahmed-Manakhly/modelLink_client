export const getMessageReceipt = (message, isOwnMessage) => {
    if (!isOwnMessage) return null;
    if (message?.status === 'READ') return '✓✓';
    return '✓';
};

export const getMessagePreview = (lastMessage) => {
    if (!lastMessage) return '';
    if (typeof lastMessage === 'string' && lastMessage.startsWith('messages/')) {
        return '📷 Image';
    }
    const text = String(lastMessage);
    return text.length > 20 ? `${text.slice(0, 20)} ...` : text;
};

const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
};

export const buildChatDisplayItems = (messages = []) => {
    const items = [];
    let lastDateKey = null;
    let lastUserId = null;

    messages.forEach((message) => {
        const dateKey = new Date(message.createdAt).toDateString();
        if (dateKey !== lastDateKey) {
            items.push({
                type: 'date',
                key: `date-${dateKey}-${message.id ?? message.createdAt}`,
                label: formatDateLabel(message.createdAt),
            });
            lastDateKey = dateKey;
            lastUserId = null;
        }

        const isGrouped = message.userId === lastUserId;
        items.push({
            type: 'message',
            key: message.id ?? `${message.createdAt}-${message.userId}`,
            message,
            isGrouped,
        });
        lastUserId = message.userId;
    });

    return items;
};

export const groupNotificationsByDay = (notifications = []) => {
    const groups = new Map();
    notifications.forEach((notification) => {
        const dayKey = new Date(notification.createdAt).toDateString();
        if (!groups.has(dayKey)) {
            groups.set(dayKey, {
                label: formatDateLabel(notification.createdAt),
                items: [],
            });
        }
        groups.get(dayKey).items.push(notification);
    });
    return Array.from(groups.values());
};

export const NOTIFICATION_TYPE_OPTIONS = [
    { value: '', label: 'All types' },
    { value: 'ORDER', label: 'Orders' },
    { value: 'REVIEW', label: 'Reviews' },
    { value: 'MODEL', label: 'Models' },
    { value: 'MESSAGE', label: 'Messages' },
    { value: 'SYSTEM', label: 'System' },
];

export const getNotificationType = (notification) => {
    if (notification?.type) return notification.type;
    const desc = (notification?.actionDesc || '').toLowerCase();
    if (desc.includes('order') || desc.includes('delivery') || desc.includes('payment')) return 'ORDER';
    if (desc.includes('review')) return 'REVIEW';
    if (desc.includes('model') || desc.includes('archived')) return 'MODEL';
    return 'SYSTEM';
};

export const getNotificationTypeLabel = (type) =>
    NOTIFICATION_TYPE_OPTIONS.find((o) => o.value === type)?.label || type || 'System';
