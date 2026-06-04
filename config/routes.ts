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
        name: '登录',
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
    name: '个人设置',
    component: './account/settings',
    hideInMenu: true,
  },

  // ==================== 1. 工作台 ====================
  {
    path: '/dashboard',
    name: '工作台',
    icon: 'AppstoreOutlined',
    routes: [
      {
        name: '首页',
        path: '/dashboard/welcome',
        icon: 'HomeOutlined',
        component: './Welcome',
      },
      {
        name: '我的工作台',
        path: '/dashboard/desk',
        icon: 'DashboardOutlined',
        component: './Dashboard/Desk',
      },
      {
        name: '消息中心',
        path: '/dashboard/message',
        icon: 'BellOutlined',
        component: './Dashboard/Message',
      },
      {
        name: '预警中心',
        path: '/dashboard/alarm',
        icon: 'WarningOutlined',
        component: './Dashboard/Alarm',
      },
      {
        name: '待办任务',
        path: '/dashboard/tasks',
        icon: 'UnorderedListOutlined',
        component: './Dashboard/Tasks',
      },
    ],
  },

  // ==================== 2. 主数据管理 ====================
  {
    path: '/base',
    name: '主数据管理',
    icon: 'DatabaseOutlined',
    routes: [
      // 耗材端主数据分组 (isConsumableDomain)
      {
        path: '/base/c-material',
        name: '耗材管理',
        access: 'isConsumableDomain',
        routes: [
          {
            name: '耗材目录',
            path: '/base/c-material/items',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: 'UDI管理',
            path: '/base/c-material/udi',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
          {
            name: '耗材分类维护',
            path: '/base/c-material/category',
            icon: 'TagOutlined',
            component: './EmptyPage',
          },
          {
            name: '计量单位维护',
            path: '/base/c-material/unit',
            icon: 'CalculatorOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端主数据分组 (isMedicineDomain)
      {
        path: '/base/m-material',
        name: '药品管理',
        access: 'isMedicineDomain',
        routes: [
          {
            name: '药品目录',
            path: '/base/m-material/items',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: '药品追溯码',
            path: '/base/m-material/code',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
          {
            name: '药品分类维护',
            path: '/base/m-material/category',
            icon: 'TagOutlined',
            component: './EmptyPage',
          },
          {
            name: '计量单位维护',
            path: '/base/m-material/unit',
            icon: 'CalculatorOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 通用数据分组
      {
        path: '/base/supplier',
        name: '供应商数据',
        routes: [
          {
            name: '供应商档案',
            path: '/base/supplier/profile',
            icon: 'IdcardOutlined',
            component: './EmptyPage',
          },
          {
            name: '供应商证照',
            path: '/base/supplier/certs',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
          {
            name: '供应商绩效',
            path: '/base/supplier/kpi',
            icon: 'StarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/base/price',
        name: '价格数据',
        routes: [
          {
            name: '价格目录',
            path: '/base/price/list',
            icon: 'DollarOutlined',
            component: './EmptyPage',
          },
          {
            name: '调价申请',
            path: '/base/price/apply',
            icon: 'SwapOutlined',
            component: './EmptyPage',
          },
          {
            name: '价格历史',
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
    name: '采购管理',
    icon: 'ShoppingCartOutlined',
    routes: [
      {
        path: '/procurement/orders',
        name: '计划与订单',
        routes: [
          {
            name: '采购计划',
            path: '/procurement/orders/plan',
            icon: 'CalendarOutlined',
            component: './EmptyPage',
          },
          {
            name: '采购订单',
            path: '/procurement/orders/list',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: '订单发送追踪',
            path: '/procurement/orders/track',
            icon: 'SendOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/procurement/contract',
        name: '合同与退货',
        routes: [
          {
            name: '采购合同',
            path: '/procurement/contract/list',
            icon: 'AuditOutlined',
            component: './EmptyPage',
          },
          {
            name: '退货管理',
            path: '/procurement/contract/returns',
            icon: 'RollbackOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/procurement/check',
        name: '验收',
        routes: [
          {
            name: '收货验收',
            path: '/procurement/check/receiving',
            icon: 'InboxOutlined',
            component: './EmptyPage',
          },
          {
            name: '质检记录',
            path: '/procurement/check/qa',
            icon: 'SafetyOutlined',
            component: './EmptyPage',
          },
        ],
      },
    ],
  },

  // ==================== 4. 仓储管理 ====================
  {
    path: '/warehousing',
    name: '仓储管理',
    icon: 'HomeOutlined',
    routes: [
      {
        path: '/warehousing/setup',
        name: '库房管理',
        routes: [
          {
            name: '货位管理',
            path: '/warehousing/setup/location',
            icon: 'EnvironmentOutlined',
            component: './EmptyPage',
          },
          {
            name: '温湿度监控',
            path: '/warehousing/setup/temp',
            icon: 'ExperimentOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/io',
        name: '入出库',
        routes: [
          {
            name: '入库管理',
            path: '/warehousing/io/in',
            icon: 'LoginOutlined',
            component: './EmptyPage',
          },
          {
            name: '出库管理',
            path: '/warehousing/io/out',
            icon: 'LogoutOutlined',
            component: './EmptyPage',
          },
          {
            name: '库存调拨',
            path: '/warehousing/io/transfer',
            icon: 'BranchesOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/stocktake',
        name: '盘点与报损',
        routes: [
          {
            name: '库存盘点',
            path: '/warehousing/stocktake/check',
            icon: 'AuditOutlined',
            component: './EmptyPage',
          },
          {
            name: '报损管理',
            path: '/warehousing/stocktake/damage',
            icon: 'DeleteOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/warehousing/query',
        name: '库存查询',
        routes: [
          {
            name: '实时库存',
            path: '/warehousing/query/realtime',
            icon: 'EyeOutlined',
            component: './EmptyPage',
          },
          {
            name: '库存流水',
            path: '/warehousing/query/flow',
            icon: 'HistoryOutlined',
            component: './EmptyPage',
          },
          {
            name: '库存预警',
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
    name: '配送管理',
    icon: 'TruckOutlined',
    routes: [
      {
        path: '/distribution/package',
        name: '定数包',
        routes: [
          {
            name: '定数包配置',
            path: '/distribution/package/config',
            icon: 'GiftOutlined',
            component: './EmptyPage',
          },
          {
            name: '标签打印',
            path: '/distribution/package/print',
            icon: 'PrinterOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/distribution/deliver',
        name: '申领配送',
        routes: [
          {
            name: '科室申领单',
            path: '/distribution/deliver/request',
            icon: 'ShoppingOutlined',
            component: './EmptyPage',
          },
          {
            name: '配送任务',
            path: '/distribution/deliver/tasks',
            icon: 'InboxOutlined',
            component: './EmptyPage',
          },
          {
            name: '配送路线',
            path: '/distribution/deliver/routes',
            icon: 'ForkOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/distribution/return',
        name: '退库',
        routes: [
          {
            name: '科室退库',
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
    name: '消耗追溯',
    icon: 'MedicineBoxOutlined',
    routes: [
      {
        path: '/trace/dept-store',
        name: '科室库',
        routes: [
          {
            name: '科室库存',
            path: '/trace/dept-store/stock',
            icon: 'GoldOutlined',
            component: './EmptyPage',
          },
          {
            name: '取用记录',
            path: '/trace/dept-store/record',
            icon: 'TransactionOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 耗材端专有
      {
        path: '/trace/surgery-c',
        name: '手术室',
        access: 'isConsumableDomain',
        routes: [
          {
            name: '手术耗材管理',
            path: '/trace/surgery-c/items',
            icon: 'ScissorOutlined',
            component: './EmptyPage',
          },
          {
            name: '高值耗材收费',
            path: '/trace/surgery-c/charge',
            icon: 'DollarCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端专有
      {
        path: '/trace/surgery-m',
        name: '手术室',
        access: 'isMedicineDomain',
        routes: [
          {
            name: '手术用药管理',
            path: '/trace/surgery-m/items',
            icon: 'ScissorOutlined',
            component: './EmptyPage',
          },
          {
            name: '特殊药品监管',
            path: '/trace/surgery-m/special',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/trace/history',
        name: '追溯',
        routes: [
          {
            name: '消耗追溯查询',
            path: '/trace/history/query',
            icon: 'DeploymentUnitOutlined',
            component: './EmptyPage',
          },
          {
            name: '患者级追溯',
            path: '/trace/history/patient',
            icon: 'UserOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/trace/his',
        name: 'HIS对接',
        routes: [
          {
            name: '收费核对',
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
    name: '财务结算',
    icon: 'FileTextOutlined',
    routes: [
      {
        path: '/finance/reconcile',
        name: '对账',
        routes: [
          {
            name: '结算对账单',
            path: '/finance/reconcile/statement',
            icon: 'FileExcelOutlined',
            component: './EmptyPage',
          },
          {
            name: '在线对账确认',
            path: '/finance/reconcile/confirm',
            icon: 'CheckCircleOutlined',
            component: './EmptyPage',
          },
          {
            name: '对账异议处理',
            path: '/finance/reconcile/dispute',
            icon: 'QuestionCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/finance/invoice',
        name: '发票',
        routes: [
          {
            name: '发票管理',
            path: '/finance/invoice/mgr',
            icon: 'PayCircleOutlined',
            component: './EmptyPage',
          },
          {
            name: '三单合一核对',
            path: '/finance/invoice/verify',
            icon: 'CopyOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 耗材端分析
      {
        path: '/finance/analysis-c',
        name: '分析',
        access: 'isConsumableDomain',
        routes: [
          {
            name: '耗占比分析',
            path: '/finance/analysis-c/ratio',
            icon: 'PieChartOutlined',
            component: './EmptyPage',
          },
          {
            name: '成本趋势',
            path: '/finance/analysis-c/trend',
            icon: 'RiseOutlined',
            component: './EmptyPage',
          },
          {
            name: 'DRG成本分析',
            path: '/finance/analysis-c/drg',
            icon: 'FundOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端分析
      {
        path: '/finance/analysis-m',
        name: '分析',
        access: 'isMedicineDomain',
        routes: [
          {
            name: '药占比分析',
            path: '/finance/analysis-m/ratio',
            icon: 'PieChartOutlined',
            component: './EmptyPage',
          },
          {
            name: '成本趋势',
            path: '/finance/analysis-m/trend',
            icon: 'RiseOutlined',
            component: './EmptyPage',
          },
          {
            name: 'DRG成本分析',
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
    name: '报表分析',
    icon: 'LineChartOutlined',
    routes: [
      {
        path: '/analytics/stock',
        name: '库存报表',
        routes: [
          {
            name: '库存总览大屏',
            path: '/analytics/stock/dashboard',
            icon: 'DashboardOutlined',
            component: './EmptyPage',
          },
          {
            name: '预警报表',
            path: '/analytics/stock/alarm',
            icon: 'WarningOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/analytics/biz',
        name: '业务报表',
        routes: [
          {
            name: '采购统计报表',
            path: '/analytics/biz/procurement',
            icon: 'BarChartOutlined',
            component: './EmptyPage',
          },
          {
            name: '消耗分析报表',
            path: '/analytics/biz/consumption',
            icon: 'LineChartOutlined',
            component: './EmptyPage',
          },
          {
            name: '供应商绩效报表',
            path: '/analytics/biz/supplier',
            icon: 'StarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/analytics/custom',
        name: '自定义',
        routes: [
          {
            name: '自定义报表',
            path: '/analytics/custom/report',
            icon: 'SlidersOutlined',
            component: './EmptyPage',
          },
          {
            name: '报表导出中心',
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
    name: '供应商门户 (SCP)',
    icon: 'GlobalOutlined',
    routes: [
      {
        path: '/scp/workdesk',
        name: '协同工作台',
        routes: [
          {
            name: '供应商工作台',
            path: '/scp/workdesk/home',
            icon: 'HomeOutlined',
            component: './EmptyPage',
          },
          {
            name: '订单协同',
            path: '/scp/workdesk/orders',
            icon: 'InteractionOutlined',
            component: './EmptyPage',
          },
          {
            name: '发货管理',
            path: '/scp/workdesk/delivery',
            icon: 'CarOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/scp/finance',
        name: '资质与财务',
        routes: [
          {
            name: '证照维护',
            path: '/scp/finance/certs',
            icon: 'SafetyCertificateOutlined',
            component: './EmptyPage',
          },
          {
            name: '在线对账',
            path: '/scp/finance/reconcile',
            icon: 'TransactionOutlined',
            component: './EmptyPage',
          },
          {
            name: '发票上传',
            path: '/scp/finance/invoice',
            icon: 'UploadOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/scp/data',
        name: '数据',
        routes: [
          {
            name: '消耗数据查看',
            path: '/scp/data/consumption',
            icon: 'DatabaseOutlined',
            component: './EmptyPage',
          },
          {
            name: '绩效评分',
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
    name: '智能设备',
    icon: 'ApiOutlined',
    routes: [
      // 耗材端专有
      {
        path: '/device/mgr-c',
        name: '设备管理',
        access: 'isConsumableDomain',
        routes: [
          {
            name: '智能柜管理',
            path: '/device/mgr-c/cabinet',
            icon: 'AppstoreOutlined',
            component: './EmptyPage',
          },
          {
            name: 'RFID设备',
            path: '/device/mgr-c/rfid',
            icon: 'WifiOutlined',
            component: './EmptyPage',
          },
          {
            name: '扫码枪管理',
            path: '/device/mgr-c/scanner',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
        ],
      },
      // 药品端专有
      {
        path: '/device/mgr-m',
        name: '设备管理',
        access: 'isMedicineDomain',
        routes: [
          {
            name: '智能柜管理',
            path: '/device/mgr-m/cabinet',
            icon: 'AppstoreOutlined',
            component: './EmptyPage',
          },
          {
            name: '智能药柜毒麻柜',
            path: '/device/mgr-m/drug-cabinet',
            icon: 'WifiOutlined',
            component: './EmptyPage',
          },
          {
            name: '扫码枪管理',
            path: '/device/mgr-m/scanner',
            icon: 'ScanOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/device/sync',
        name: '数据同步',
        routes: [
          {
            name: '设备数据同步',
            path: '/device/sync/data',
            icon: 'SyncOutlined',
            component: './EmptyPage',
          },
          {
            name: '设备异常告警',
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
    name: '系统管理',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/system/org',
        name: '组织与用户',
        routes: [
          {
            name: '机构/科室管理',
            path: '/system/org/dept',
            icon: 'ApartmentOutlined',
            component: './EmptyPage',
          },
          {
            name: '员工管理',
            path: '/system/org/staff',
            icon: 'UserOutlined',
            component: './EmptyPage',
          },
          {
            name: '用户组管理',
            path: '/system/org/group',
            icon: 'TeamOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/auth',
        name: '权限',
        routes: [
          {
            name: '角色管理',
            path: '/system/auth/roles',
            icon: 'KeyOutlined',
            component: './EmptyPage',
          },
          {
            name: '权限配置',
            path: '/system/auth/permissions',
            icon: 'SafetyOutlined',
            component: './EmptyPage',
          },
          {
            name: '菜单管理',
            path: '/system/auth/menu',
            icon: 'MenuOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/tenant',
        name: '租户',
        routes: [
          {
            name: '租户管理',
            path: '/system/tenant/mgr',
            icon: 'ClusterOutlined',
            component: './EmptyPage',
          },
          {
            name: '模块开通管理',
            path: '/system/tenant/modules',
            icon: 'AppstoreAddOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/base',
        name: '基础数据',
        routes: [
          {
            name: '数据字典',
            path: '/system/base/dicts',
            icon: 'BookOutlined',
            component: './EmptyPage',
          },
          {
            name: '系统参数',
            path: '/system/base/params',
            icon: 'SlidersOutlined',
            component: './EmptyPage',
          },
          {
            name: '单号生成规则',
            path: '/system/base/rules',
            icon: 'BarcodeOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/system/notify',
        name: '通知',
        routes: [
          {
            name: '消息通知配置',
            path: '/system/notify/config',
            icon: 'NotificationOutlined',
            component: './EmptyPage',
          },
          {
            name: '邮件/短信模板',
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
    name: '运维工具',
    icon: 'BuildOutlined',
    routes: [
      {
        path: '/tool/logs',
        name: '日志监控',
        routes: [
          {
            name: '操作日志',
            path: '/tool/logs/operation',
            icon: 'FileTextOutlined',
            component: './EmptyPage',
          },
          {
            name: '登录日志',
            path: '/tool/logs/login',
            icon: 'LoginOutlined',
            component: './EmptyPage',
          },
          {
            name: '服务心跳监控',
            path: '/tool/logs/heartbeat',
            icon: 'HeartOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/jobs',
        name: '任务',
        routes: [
          {
            name: '定时任务管理',
            path: '/tool/jobs/cron',
            icon: 'ClockCircleOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/dev',
        name: '开发工具',
        routes: [
          {
            name: '接口文档 (Knife4j)',
            path: '/tool/dev/api-doc',
            icon: 'ApiOutlined',
            component: './EmptyPage',
          },
          {
            name: '代码生成器',
            path: '/tool/dev/codegen',
            icon: 'CodeOutlined',
            component: './EmptyPage',
          },
          {
            name: '数据变更记录',
            path: '/tool/dev/changelog',
            icon: 'HistoryOutlined',
            component: './EmptyPage',
          },
          {
            name: '附件管理',
            path: '/tool/dev/attachments',
            icon: 'PaperClipOutlined',
            component: './EmptyPage',
          },
        ],
      },
      {
        path: '/tool/security',
        name: '安全',
        routes: [
          {
            name: '密码策略配置',
            path: '/tool/security/password',
            icon: 'LockOutlined',
            component: './EmptyPage',
          },
          {
            name: '等保安全审计',
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
