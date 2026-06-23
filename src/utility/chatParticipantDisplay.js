const STAFF_ROLES = ['ADMIN', 'EMPLOYEE'];

export const PLATFORM_SUPPORT_LABEL = 'ModelLink Support';

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

export function buildPlatformSupportUser(participantEmbed = {}) {
  return {
    id: null,
    first_name: 'ModelLink',
    last_name: 'Support',
    org_username: 'ML',
    subtitle: 'Official platform message',
    avatar: null,
    isPlatformAccount: true,
    role: participantEmbed?.role || 'ADMIN',
    isVerified: false,
  };
}

export function resolveCounterpartyUser(participantEmbed, fetchedUser, { apiForbidden = false } = {}) {
  const embeddedRole = participantEmbed?.role;
  if (isStaffRole(embeddedRole)) {
    return buildPlatformSupportUser(participantEmbed);
  }

  if (fetchedUser) {
    if (isStaffRole(fetchedUser.role)) {
      return buildPlatformSupportUser(fetchedUser);
    }
    return { ...fetchedUser, isPlatformAccount: false };
  }

  if (apiForbidden && isStaffRole(embeddedRole)) {
    return buildPlatformSupportUser(participantEmbed);
  }

  if (participantEmbed) {
    return { ...participantEmbed, isPlatformAccount: false };
  }

  return null;
}

export function getCounterpartyDisplayName(user) {
  if (!user) return '';
  if (user.isPlatformAccount) return PLATFORM_SUPPORT_LABEL;
  const full = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return full || user.org_username || '';
}

export function getCounterpartyInitial(user) {
  if (!user) return '?';
  if (user.isPlatformAccount) return 'ML';
  return user.org_username?.[0]?.toUpperCase() || '?';
}

export function getCounterpartyProfileLink(user) {
  if (!user || user.isPlatformAccount || !user.id) return null;
  return `/profile/${user.id}`;
}

export function dedupeChatsByCounterparty(chats, currentUserId) {
  if (!Array.isArray(chats) || !currentUserId) return chats || [];

  const seen = new Map();
  for (const chat of chats) {
    const counterpartyId = chat.participants?.find((p) => p.userId !== currentUserId)?.userId;
    const key = chat.pairKey || counterpartyId;
    if (!key) continue;

    const existing = seen.get(key);
    if (!existing || new Date(chat.updatedAt) > new Date(existing.updatedAt)) {
      seen.set(key, chat);
    }
  }

  return Array.from(seen.values());
}
