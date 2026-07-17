import React from 'react';
import { FILES_BASE_API_URL } from '../../lib/api';
import teamPlaceholder from '../../assets/team_placeholder.svg';

const UserAvatar = ({ user, className, style }) => {
  if (!user) return null;

  // 1. SYSTEM Notification: Use the site favicon
  if (user.role === 'SYSTEM') {
    return (
      <img
        src={process.env.PUBLIC_URL + '/favicon.svg'}
        alt="System Avatar"
        className={`global-avatar ${className || ''}`}
        style={style}
      />
    );
  }

  // 2. Real User Avatar: Ensure it covers the circle and is slightly larger
  if (user.avatar) {
    return (
      <img
        src={`${FILES_BASE_API_URL}${user.avatar}`}
        alt="Avatar"
        crossOrigin="anonymous"
        className={`global-avatar ${className || ''}`}
        style={style}
      />
    );
  }

  // 3. Fallback to team placeholder image
  return (
    <img
      src={teamPlaceholder}
      alt="Avatar Placeholder"
      className={`global-avatar ${className || ''}`}
      style={style}
    />
  );
};

export default UserAvatar;
