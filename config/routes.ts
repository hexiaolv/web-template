/**
 * @name SPD供应链管理平台闭环路由配置 (基于截图1,2功能模块体系 + 高拟真图标配置)
 * @description 根据截图定制，共12个大模块，支持药品和耗材双业务域隔离大重构，侧边菜单以分组模式显示，且子菜单完全配有一比一拟真图标。
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/welcome',
  },
  {
    path: '/account/settings',
    name: 'settings',
    component: './account/settings',
    hideInMenu: true,
  },

  // ==================== 1. 工作台 ====================
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'AppstoreOutlined',
    routes: [
      {
        name: 'welcome',
        path: '/dashboard/welcome',
        icon: 'HomeOutlined',
        component: './Welcome',
      },
      {
        name: 'desk',
        path: '/dashboard/desk',
        icon: 'DashboardOutlined',
        component: './Dashboard/Desk',
      },
      {
        name: 'message',
        path: '/dashboard/message',
        icon: 'BellOutlined',
        component: './Dashboard/Message',
      },
      {
        name: 'alarm',
        path: '/dashboard/alarm',
        icon: 'WarningOutlined',
        component: './Dashboard/Alarm',
      },
      {
        name: 'tasks',
        path: '/dashboard/tasks',
        icon: 'UnorderedListOutlined',
        component: './Dashboard/Tasks',
      },
    ],
  },

  // ==================== 2. 主数据管理 ====================
  {
    path: '/base',
    name: 'base',
    icon: 'DatabaseOutlined',
    routes: [
      // 耗材端主数据分组 (isConsumableDomain)
      {
        path: '/base/c-material',
        name: 'c-material',
        access: 'isConsumableDomain',
        routes: [
          {
            name: 'items',
            path: '/base/c-material/items',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: 'udi',
            path: '/base/c-material/udi',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
          {
            name: 'category',
            path: '/base/c-material/category',
            icon: 'TagOutlined',
            component: './EmptyPage',
          },
          {
            name: 'unit',
            path: '/base/c-material/unit',
            icon: 'CalculatorOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端主数据分组 (isMedicineDomain)
      {
        path: '/base/m-material',
        name: 'm-material',
        access: 'isMedicineDomain',
        routes: [
          {
            name: 'items',
            path: '/base/m-material/items',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: 'code',
            path: '/base/m-material/code',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
          {
            name: 'category',
            path: '/base/m-material/category',
            icon: 'TagOutlined',
            component: './EmptyPage',
          },
          {
            name: 'unit',
            path: '/base/m-material/unit',
            icon: 'CalculatorOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 通用数据分组
      {
        path: '/base/supplier',
        name: 'supplier',
        routes: [
          {
            name: 'profile',
            path: '/base/supplier/profile',
            icon: 'IdcardOutlined',
            component: './EmptyPage',
          },
          {
            name: 'certs',
            path: '/base/supplier/certs',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
          {
            name: 'kpi',
            path: '/base/supplier/kpi',
            icon: 'StarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/base/price',
        name: 'price',
        routes: [
          {
            name: 'list',
            path: '/base/price/list',
            icon: 'DollarOutlined',
            component: './EmptyPage',
          },
          {
            name: 'apply',
            path: '/base/price/apply',
            icon: 'SwapOutlined',
            component: './EmptyPage',
          },
          {
            name: 'history',
            path: '/base/price/history',
            icon: 'LineChartOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 3. 采购管理 ====================
  {
    path: '/procurement',
    name: 'procurement',
    icon: 'ShoppingCartOutlined',
    routes: [
      {
        path: '/procurement/orders',
        name: 'orders',
        routes: [
          {
            name: 'plan',
            path: '/procurement/orders/plan',
            icon: 'CalendarOutlined',
            component: './procurement/orders/plan',
          },
          {
            name: 'list',
            path: '/procurement/orders/list',
            icon: 'FileTextOutlined',
            component: './procurement/orders/list',
          },
          {
            name: 'track',
            path: '/procurement/orders/track',
            icon: 'SendOutlined',
            component: './procurement/orders/track',
          },
        ],
      },
      {
        path: '/procurement/contract',
        name: 'contract',
        routes: [
          {
            name: 'list',
            path: '/procurement/contract/list',
            icon: 'AuditOutlined',
            component: './procurement/contract/list',
          },
          {
            name: 'returns',
            path: '/procurement/contract/returns',
            icon: 'RollbackOutlined',
            component: './procurement/contract/returns',
          },
        ],
      },
      {
        path: '/procurement/check',
        name: 'check',
        routes: [
          {
            name: 'receiving',
            path: '/procurement/check/receiving',
            icon: 'InboxOutlined',
            component: './procurement/check/receiving',
          },
          {
            name: 'qa',
            path: '/procurement/check/qa',
            icon: 'SafetyOutlined',
            component: './procurement/check/qa',
          },
        ],
      },
    ],
  },

  // ==================== 4. 仓储管理 ====================
  {
    path: '/warehousing',
    name: 'warehousing',
    icon: 'HomeOutlined',
    routes: [
      {
        path: '/warehousing/setup',
        name: 'setup',
        routes: [
          {
            name: 'location',
            path: '/warehousing/setup/location',
            icon: 'EnvironmentOutlined',
            component: './EmptyPage',
          },
          {
            name: 'temp',
            path: '/warehousing/setup/temp',
            icon: 'ExperimentOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/io',
        name: 'io',
        routes: [
          {
            name: 'in',
            path: '/warehousing/io/in',
            icon: 'LoginOutlined',
            component: './EmptyPage',
          },
          {
            name: 'out',
            path: '/warehousing/io/out',
            icon: 'LogoutOutlined',
            component: './EmptyPage',
          },
          {
            name: 'transfer',
            path: '/warehousing/io/transfer',
            icon: 'BranchesOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/stocktake',
        name: 'stocktake',
        routes: [
          {
            name: 'check',
            path: '/warehousing/stocktake/check',
            icon: 'AuditOutlined',
            component: './EmptyPage',
          },
          {
            name: 'damage',
            path: '/warehousing/stocktake/damage',
            icon: 'DeleteOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/query',
        name: 'query',
        routes: [
          {
            name: 'realtime',
            path: '/warehousing/query/realtime',
            icon: 'EyeOutlined',
            component: './EmptyPage',
          },
          {
            name: 'flow',
            path: '/warehousing/query/flow',
            icon: 'HistoryOutlined',
            component: './EmptyPage',
          },
          {
            name: 'alarm',
            path: '/warehousing/query/alarm',
            icon: 'AlertOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 5. 配送管理 ====================
  {
    path: '/distribution',
    name: 'distribution',
    icon: 'TruckOutlined',
    routes: [
      {
        path: '/distribution/package',
        name: 'package',
        routes: [
          {
            name: 'config',
            path: '/distribution/package/config',
            icon: 'GiftOutlined',
            component: './EmptyPage',
          },
          {
            name: 'print',
            path: '/distribution/package/print',
            icon: 'PrinterOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/distribution/deliver',
        name: 'deliver',
        routes: [
          {
            name: 'request',
            path: '/distribution/deliver/request',
            icon: 'ShoppingOutlined',
            component: './EmptyPage',
          },
          {
            name: 'tasks',
            path: '/distribution/deliver/tasks',
            icon: 'InboxOutlined',
            component: './EmptyPage',
          },
          {
            name: 'routes',
            path: '/distribution/deliver/routes',
            icon: 'ForkOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/distribution/return',
        name: 'return',
        routes: [
          {
            name: 'dept',
            path: '/distribution/return/dept',
            icon: 'RollbackOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 6. 消耗追溯 ====================
  {
    path: '/trace',
    name: 'trace',
    icon: 'MedicineBoxOutlined',
    routes: [
      {
        path: '/trace/dept-store',
        name: 'dept-store',
        routes: [
          {
            name: 'stock',
            path: '/trace/dept-store/stock',
            icon: 'GoldOutlined',
            component: './EmptyPage',
          },
          {
            name: 'record',
            path: '/trace/dept-store/record',
            icon: 'TransactionOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 耗材端专有
      {
        path: '/trace/surgery-c',
        name: 'surgery-c',
        access: 'isConsumableDomain',
        routes: [
          {
            name: 'items',
            path: '/trace/surgery-c/items',
            icon: 'ScissorOutlined',
            component: './EmptyPage',
          },
          {
            name: 'charge',
            path: '/trace/surgery-c/charge',
            icon: 'DollarCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端专有
      {
        path: '/trace/surgery-m',
        name: 'surgery-m',
        access: 'isMedicineDomain',
        routes: [
          {
            name: 'items',
            path: '/trace/surgery-m/items',
            icon: 'ScissorOutlined',
            component: './EmptyPage',
          },
          {
            name: 'special',
            path: '/trace/surgery-m/special',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/trace/history',
        name: 'history',
        routes: [
          {
            name: 'query',
            path: '/trace/history/query',
            icon: 'DeploymentUnitOutlined',
            component: './EmptyPage',
          },
          {
            name: 'patient',
            path: '/trace/history/patient',
            icon: 'UserOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/trace/his',
        name: 'his',
        routes: [
          {
            name: 'reconcile',
            path: '/trace/his/reconcile',
            icon: 'SyncOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 7. 财务结算 ====================
  {
    path: '/finance',
    name: 'finance',
    icon: 'FileTextOutlined',
    routes: [
      {
        path: '/finance/reconcile',
        name: 'reconcile',
        routes: [
          {
            name: 'statement',
            path: '/finance/reconcile/statement',
            icon: 'FileExcelOutlined',
            component: './EmptyPage',
          },
          {
            name: 'confirm',
            path: '/finance/reconcile/confirm',
            icon: 'CheckCircleOutlined',
            component: './EmptyPage',
          },
          {
            name: 'dispute',
            path: '/finance/reconcile/dispute',
            icon: 'QuestionCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/finance/invoice',
        name: 'invoice',
        routes: [
          {
            name: 'mgr',
            path: '/finance/invoice/mgr',
            icon: 'PayCircleOutlined',
            component: './EmptyPage',
          },
          {
            name: 'verify',
            path: '/finance/invoice/verify',
            icon: 'CopyOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 耗材端分析
      {
        path: '/finance/analysis-c',
        name: 'analysis-c',
        access: 'isConsumableDomain',
        routes: [
          {
            name: 'ratio',
            path: '/finance/analysis-c/ratio',
            icon: 'PieChartOutlined',
            component: './EmptyPage',
          },
          {
            name: 'trend',
            path: '/finance/analysis-c/trend',
            icon: 'RiseOutlined',
            component: './EmptyPage',
          },
          {
            name: 'drg',
            path: '/finance/analysis-c/drg',
            icon: 'FundOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端分析
      {
        path: '/finance/analysis-m',
        name: 'analysis-m',
        access: 'isMedicineDomain',
        routes: [
          {
            name: 'ratio',
            path: '/finance/analysis-m/ratio',
            icon: 'PieChartOutlined',
            component: './EmptyPage',
          },
          {
            name: 'trend',
            path: '/finance/analysis-m/trend',
            icon: 'RiseOutlined',
            component: './EmptyPage',
          },
          {
            name: 'drg',
            path: '/finance/analysis-m/drg',
            icon: 'FundOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 8. 报表分析 ====================
  {
    path: '/analytics',
    name: 'analytics',
    icon: 'LineChartOutlined',
    routes: [
      {
        path: '/analytics/stock',
        name: 'stock',
        routes: [
          {
            name: 'dashboard',
            path: '/analytics/stock/dashboard',
            icon: 'DashboardOutlined',
            component: './EmptyPage',
          },
          {
            name: 'alarm',
            path: '/analytics/stock/alarm',
            icon: 'WarningOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/analytics/biz',
        name: 'biz',
        routes: [
          {
            name: 'procurement',
            path: '/analytics/biz/procurement',
            icon: 'BarChartOutlined',
            component: './EmptyPage',
          },
          {
            name: 'consumption',
            path: '/analytics/biz/consumption',
            icon: 'LineChartOutlined',
            component: './EmptyPage',
          },
          {
            name: 'supplier',
            path: '/analytics/biz/supplier',
            icon: 'StarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/analytics/custom',
        name: 'custom',
        routes: [
          {
            name: 'report',
            path: '/analytics/custom/report',
            icon: 'SlidersOutlined',
            component: './EmptyPage',
          },
          {
            name: 'export',
            path: '/analytics/custom/export',
            icon: 'DownloadOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 9. 供应商门户 (SCP) ====================
  {
    path: '/scp',
    name: 'scp',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/scp/workdesk',
        name: 'workdesk',
        routes: [
          {
            name: 'home',
            path: '/scp/workdesk/home',
            icon: 'HomeOutlined',
            component: './EmptyPage',
          },
          {
            name: 'orders',
            path: '/scp/workdesk/orders',
            icon: 'InteractionOutlined',
            component: './EmptyPage',
          },
          {
            name: 'delivery',
            path: '/scp/workdesk/delivery',
            icon: 'CarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/scp/finance',
        name: 'finance',
        routes: [
          {
            name: 'certs',
            path: '/scp/finance/certs',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
          {
            name: 'reconcile',
            path: '/scp/finance/reconcile',
            icon: 'TransactionOutlined',
            component: './EmptyPage',
          },
          {
            name: 'invoice',
            path: '/scp/finance/invoice',
            icon: 'UploadOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/scp/data',
        name: 'data',
        routes: [
          {
            name: 'consumption',
            path: '/scp/data/consumption',
            icon: 'DatabaseOutlined',
            component: './EmptyPage',
          },
          {
            name: 'kpi',
            path: '/scp/data/kpi',
            icon: 'StarOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 10. 智能设备 ====================
  {
    path: '/device',
    name: 'device',
    icon: 'ApiOutlined',
    routes: [
      // 耗材端专有
      {
        path: '/device/mgr-c',
        name: 'mgr-c',
        access: 'isConsumableDomain',
        routes: [
          {
            name: 'cabinet',
            path: '/device/mgr-c/cabinet',
            icon: 'AppstoreOutlined',
            component: './EmptyPage',
          },
          {
            name: 'rfid',
            path: '/device/mgr-c/rfid',
            icon: 'WifiOutlined',
            component: './EmptyPage',
          },
          {
            name: 'scanner',
            path: '/device/mgr-c/scanner',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端专有
      {
        path: '/device/mgr-m',
        name: 'mgr-m',
        access: 'isMedicineDomain',
        routes: [
          {
            name: 'cabinet',
            path: '/device/mgr-m/cabinet',
            icon: 'AppstoreOutlined',
            component: './EmptyPage',
          },
          {
            name: 'cabinet',
            path: '/device/mgr-m/drug-cabinet',
            icon: 'WifiOutlined',
            component: './EmptyPage',
          },
          {
            name: 'scanner',
            path: '/device/mgr-m/scanner',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/device/sync',
        name: 'sync',
        routes: [
          {
            name: 'data',
            path: '/device/sync/data',
            icon: 'SyncOutlined',
            component: './EmptyPage',
          },
          {
            name: 'alarm',
            path: '/device/sync/alarm',
            icon: 'AlertOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 11. 系统管理 ====================
  {
    path: '/system',
    name: 'system',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/system/org',
        name: 'org',
        routes: [
          {
            name: 'dept',
            path: '/system/org/dept',
            icon: 'ApartmentOutlined',
            component: './EmptyPage',
          },
          {
            name: 'employee',
            path: '/system/org/staff',
            icon: 'UserOutlined',
            component: './EmptyPage',
          },
          {
            name: 'group',
            path: '/system/org/group',
            icon: 'TeamOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/auth',
        name: 'permission',
        routes: [
          {
            name: 'role',
            path: '/system/auth/roles',
            icon: 'KeyOutlined',
            component: './EmptyPage',
          },
          {
            name: 'config',
            path: '/system/auth/permissions',
            icon: 'SafetyOutlined',
            component: './EmptyPage',
          },
          {
            name: 'menu',
            path: '/system/auth/menu',
            icon: 'MenuOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/tenant',
        name: 'tenant',
        routes: [
          {
            name: 'mgr',
            path: '/system/tenant/mgr',
            icon: 'ClusterOutlined',
            component: './EmptyPage',
          },
          {
            name: 'modules',
            path: '/system/tenant/modules',
            icon: 'AppstoreAddOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/base',
        name: 'master',
        routes: [
          {
            name: 'dict',
            path: '/system/base/dicts',
            icon: 'BookOutlined',
            component: './EmptyPage',
          },
          {
            name: 'params',
            path: '/system/base/params',
            icon: 'SlidersOutlined',
            component: './EmptyPage',
          },
          {
            name: 'rules',
            path: '/system/base/rules',
            icon: 'BarcodeOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/notify',
        name: 'notification',
        routes: [
          {
            name: 'config',
            path: '/system/notify/config',
            icon: 'NotificationOutlined',
            component: './EmptyPage',
          },
          {
            name: 'template',
            path: '/system/notify/templates',
            icon: 'MailOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 12. 运维工具 ====================
  {
    path: '/tool',
    name: 'operations',
    icon: 'BuildOutlined',
    routes: [
      {
        path: '/tool/logs',
        name: 'logs',
        routes: [
          {
            name: 'action',
            path: '/tool/logs/operation',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: 'login',
            path: '/tool/logs/login',
            icon: 'LoginOutlined',
            component: './EmptyPage',
          },
          {
            name: 'heartbeat',
            path: '/tool/logs/heartbeat',
            icon: 'HeartOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/jobs',
        name: 'job',
        routes: [
          {
            name: 'cron',
            path: '/tool/jobs/cron',
            icon: 'ClockCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/dev',
        name: 'tools',
        routes: [
          {
            name: 'knife4j',
            path: '/tool/dev/api-doc',
            icon: 'ApiOutlined',
            component: './EmptyPage',
          },
          {
            name: 'generator',
            path: '/tool/dev/codegen',
            icon: 'CodeOutlined',
            component: './EmptyPage',
          },
          {
            name: 'db-changes',
            path: '/tool/dev/changelog',
            icon: 'HistoryOutlined',
            component: './EmptyPage',
          },
          {
            name: 'attachment',
            path: '/tool/dev/attachments',
            icon: 'PaperClipOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/security',
        name: 'security',
        routes: [
          {
            name: 'password',
            path: '/tool/security/password',
            icon: 'LockOutlined',
            component: './EmptyPage',
          },
          {
            name: 'audit',
            path: '/tool/security/audit',
            icon: 'AuditOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  {
    component: '404',
    layout: false,
    path: './*',
  },
];
