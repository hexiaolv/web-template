/**
 * SPD 供应链管理平台极简部署专用服务 (Native Node.js Server)
 * 用途: 零依赖同时托管静态构建包 (dist) 以及返回核心 AJAX Mock 接口数据，可一键在本地或云端运行演示。
 * 启动命令: node server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_PATH = '/web-template';

// 常用 MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

// 核心 Mock 数据库
const MOCK_DATA = {
  currentUser: {
    data: {
      name: '超级管理员(院长)',
      avatar:
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'admin@spd-supply.com',
      signature: 'Antigravity Code',
      title: '首席安全官',
      group: '管理委员会',
      tags: [
        { key: '0', label: '很有想法的' },
        { key: '1', label: '专注设计' },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      geographic: {
        province: { label: '北京市', key: '110000' },
        city: { label: '北京市', key: '110100' },
      },
      address: '朝阳区和平街东口',
    },
  },
  login: {
    status: 'ok',
    type: 'account',
    currentAuthority: 'admin',
  },
  outLogin: {
    data: {},
    success: true,
  },
  notices: {
    data: [
      {
        id: '000000001',
        avatar:
          'https://gw.alipayobjects.com/zos/rmsportal/ThxoSpSn2ydrUms.png',
        title: '您收到了 14 份新物资采购申请订单，请及时审核。',
        datetime: '2026-06-05',
        type: 'notification',
      },
      {
        id: '000000002',
        avatar:
          'https://gw.alipayobjects.com/zos/rmsportal/OKDIqVIHGPqN7nd.png',
        title: '供应商“北京中科医疗器械有限公司”上传了新的合格证照。',
        datetime: '2026-06-04',
        type: 'notification',
      },
    ],
  },
  // 发货追踪单列表 (包括发货追踪所需的 24 条明细 Mock 数据)
  track: [
    {
      id: 'SH-20250603-001',
      orderId: 'PO-20250602-001',
      supplier: '北京中科医疗器械有限公司',
      logisticsCompany: '中国邮政速递物流',
      trackingNo: 'EMS1234567890CN',
      domain: 'consumable',
      branch: '主院区',
      sendTime: '2025-06-03 14:30:00',
      estimatedArrival: '2025-06-05',
      actualArrival: null,
      status: 'in_transit',
      statusName: '运输中',
      itemDesc: '一次性无菌注射器、手术衣、手套等8个品种',
      sendQty: 5,
      contactPhone: '010-88886661',
      nodes: [
        {
          time: '2025-06-03 14:30',
          location: '北京顺义仓库',
          event: '货物已装车出库',
        },
        {
          time: '2025-06-03 17:20',
          location: '北京顺义分拨中心',
          event: '已完成揽收，进入运输流程',
        },
        {
          time: '2025-06-04 06:15',
          location: '郑州中转站',
          event: '中转站已接收货物，正在转运',
        },
      ],
    },
    {
      id: 'SH-20250601-002',
      orderId: 'PO-20250602-002',
      supplier: '浙江振德医疗用品有限公司',
      logisticsCompany: '德邦物流',
      trackingNo: 'DBL9988001234',
      domain: 'consumable',
      branch: '主院区',
      sendTime: '2025-06-01 10:00:00',
      estimatedArrival: '2025-06-03',
      actualArrival: '2025-06-06 09:30',
      status: 'arrived',
      statusName: '已到达',
      itemDesc: '医用外科口罩、无菌手套等5个品种',
      sendQty: 3,
      contactPhone: '0571-88998800',
      nodes: [
        {
          time: '2025-06-01 10:00',
          location: '绍兴柯桥工厂',
          event: '货物出库，交付德邦物流',
        },
        {
          time: '2025-06-01 16:30',
          location: '绍兴德邦中转站',
          event: '已接收货物',
        },
        {
          time: '2025-06-06 09:30',
          location: '广州市花都区医院收货站台',
          event: '货物已签收入库',
        },
      ],
    },
    {
      id: 'SH-20250603-003',
      orderId: 'PO-20250601-003',
      supplier: '国药控股广州有限公司',
      logisticsCompany: '自有配送车辆',
      trackingNo: 'GDGZ-20250603-045',
      domain: 'medicine',
      branch: '主院区',
      sendTime: '2025-06-03 07:00:00',
      estimatedArrival: '2025-06-04',
      actualArrival: '2025-06-04 10:15',
      status: 'arrived',
      statusName: '已到达',
      itemDesc: '注射用奥美拉唑、氯化钠注射液等10个品种',
      sendQty: 10,
      contactPhone: '020-81882299',
      nodes: [
        {
          time: '2025-06-03 07:00',
          location: '国药广州一号冷链库',
          event: '温湿度监控正常，装车发运',
        },
        {
          time: '2025-06-04 10:15',
          location: '主院区西区药房签收',
          event: '完成入库签收',
        },
      ],
    },
  ],
};

// 辅助方法：返回 JSON 响应
const sendJSON = (res, data, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  // 统一允许跨域 (CORS) 方便前后端调试
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // 1. 处理 API Mock 请求
  if (pathname.startsWith('/api/')) {
    const apiPath = pathname.replace('/api/', '');

    if (apiPath === 'currentUser') {
      sendJSON(res, MOCK_DATA.currentUser);
    } else if (apiPath === 'login/account') {
      sendJSON(res, MOCK_DATA.login);
    } else if (apiPath === 'login/outLogin') {
      sendJSON(res, MOCK_DATA.outLogin);
    } else if (apiPath === 'notices') {
      sendJSON(res, MOCK_DATA.notices);
    } else if (apiPath === 'procurement/track') {
      sendJSON(res, { data: MOCK_DATA.track });
    } else {
      // 其它未显示声明的接口，统一返回空成功
      sendJSON(res, { data: [], success: true });
    }
    return;
  }

  // 2. 处理静态文件分发 (支持 PUBLIC_PATH 匹配)
  let staticPath = pathname;
  if (pathname.startsWith(PUBLIC_PATH)) {
    staticPath = pathname.replace(PUBLIC_PATH, '');
  }

  // 安全过滤，防止目录穿越
  let filePath = path.join(
    DIST_DIR,
    staticPath === '/' ? 'index.html' : staticPath,
  );
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // 检测文件是否存在，若不存在则回退至主 index.html (支持 SPA 历史路由刷新)
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    // 获取 MIME 类型
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // 发送静态资源内容
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log('=====================================================');
  console.log(`🚀 SPD 供应链管理平台极简部署服务已成功启动！`);
  console.log(`🔗 本地预览访问: http://localhost:${PORT}${PUBLIC_PATH}/`);
  console.log(`📡 Mock API 服务端: http://localhost:${PORT}/api/`);
  console.log(`👉 提示：已自动开启对 Hash / History 等前端路由的全套代理`);
  console.log('=====================================================');
});
