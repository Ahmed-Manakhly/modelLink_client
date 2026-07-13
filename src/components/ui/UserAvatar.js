import React from 'react';
import { FILES_BASE_API_URL } from '../../lib/api';

const getPlaceholderSvg = (role) => {
  let fillStr = '#5DB8DD'; // Default / Admin / System

  if (role === 'CLIENT') {
    fillStr = '#FF7A00'; // Orange
  } else if (role === 'DEVELOPER') {
    fillStr = '#3665B9'; // Primary Blue
  } else if (role === 'ADMIN' || role === 'SYSTEM') {
    fillStr = '#5DB8DD'; // Baby Blue
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${fillStr}" rx="10"/>
      <circle cx="50" cy="40" r="15" fill="#fff"/>
      <path d="M30 80 A20 15 0 0 1 70 80" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `;

  // Encode for use as an image src
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

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

  // 3. Fallback to role-based SVG placeholder
  const placeholderSrc = getPlaceholderSvg(user.role || user.thisUserRole || '');
  return (
    <img
      src={placeholderSrc}
      alt="Avatar Placeholder"
      className={`global-avatar ${className || ''}`}
      style={style}
    />
  );
};

export default UserAvatar;
