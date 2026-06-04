import React from 'react';

const Footer: React.FC = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '16px 0 24px 0',
        fontSize: '12px',
        color: 'rgba(0, 0, 0, 0.45)',
        width: '100%',
        userSelect: 'none',
      }}
    >
      <span>Copyright © 2026 国药控股广州有限公司</span>
      <span style={{ margin: '0 8px', color: 'rgba(0, 0, 0, 0.25)' }}>|</span>
      <span>版本号 4.0</span>
    </div>
  );
};

export default Footer;
