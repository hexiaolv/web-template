import { render } from '@testing-library/react';
import React from 'react';
import packageJson from '@root/package.json';
import Footer from './index';

// 忽略由于内部图标组件导致的 console.error (由于 @ant-design/icons 如果在测试环境下可能会报警告)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning:/.test(args[0])) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

describe('Footer Component', () => {
  it('should render correct version from package.json', () => {
    // Arrange
    const { getByText } = render(<Footer />);

    // Assert
    // 应当显示出 package.json 中配置的版本号
    expect(getByText(`v${packageJson.version}`)).toBeDefined();
  });

  it('should have a link to Ant Design Pro', () => {
    // Arrange
    const { getByText } = render(<Footer />);

    // Assert
    expect(getByText('Ant Design Pro')).toBeDefined();
  });
});
