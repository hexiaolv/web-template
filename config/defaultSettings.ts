import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  //自定义扩展配置，多页签功能开关
  tabsLayout?: boolean;
  // 首页页签路径
  homeTabPath?: string;
} = {
  navTheme: 'light',
  // 湖青色 (呼应logo色彩)
  colorPrimary: '#25B7AA',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'SPD供应链管理平台',
  pwa: true,
  logo: '/images/logo2.png',
  iconfontUrl: '',
  tabsLayout: true,
  homeTabPath: '/',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    pageContainer: {
      paddingInlinePageContainerContent: 16,
      paddingBlockPageContainerContent: 16,
    },
  },
};

export default Settings;
