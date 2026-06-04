import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/receiving': (req: any, res: any) => {
    const { status, domain, keyword, current = 1, pageSize = 10 } = req.query;

    const allReceiving = [
      {
        id: 'RC-20250604-001',
        orderId: 'PO-20250601-003',
        sender: '黄建国（国药控股广州配送司机）',
        receiver: '陈志远',
        receiveTime: '2025-06-04 10:15:00',
        domain: 'medicine',
        branch: '主院区',
        supplier: '国药控股广州有限公司',
        status: 'in_progress',
        statusName: '验收中',
        conclusion: null,
        qualifiedCount: 10,
        unqualifiedCount: 0,
        totalCount: 12,
        udiVerified: true,
        remark: '碘克沙醇2个品种暂未到货，其余10种已开始验收',
      },
      {
        id: 'RC-20250602-002',
        orderId: 'PO-20250602-002',
        sender: '陈大勇（振德医疗配送员）',
        receiver: '李建国',
        receiveTime: '2025-06-06 09:30:00',
        domain: 'consumable',
        branch: '主院区',
        supplier: '浙江振德医疗用品有限公司',
        status: 'completed',
        statusName: '验收完成',
        conclusion: 'qualified',
        qualifiedCount: 5,
        unqualifiedCount: 0,
        totalCount: 5,
        udiVerified: true,
        remark: '全部合格，已入库',
      },
      {
        id: 'RC-20250602-003',
        orderId: 'PO-20250530-006',
        sender: '王明（上海医械配送员）',
        receiver: '李建国',
        receiveTime: '2025-06-02 16:20:00',
        domain: 'consumable',
        branch: '主院区',
        supplier: '上海医疗器械股份有限公司',
        status: 'completed',
        statusName: '验收完成',
        conclusion: 'partial',
        qualifiedCount: 13,
        unqualifiedCount: 2,
        totalCount: 15,
        udiVerified: true,
        remark: '乳胶手套2个批次发现质量问题，已发起退货RT-20250603-001',
      },
      {
        id: 'RC-20250606-004',
        orderId: 'PO-20250603-004',
        sender: null,
        receiver: null,
        receiveTime: null,
        domain: 'consumable',
        branch: '主院区',
        supplier: '强生（上海）医疗器材有限公司',
        status: 'pending',
        statusName: '待验收',
        conclusion: null,
        qualifiedCount: 0,
        unqualifiedCount: 0,
        totalCount: 6,
        udiVerified: false,
        remark: '骨科高值植入物预计6月6日到达，需安排专人验收',
      },
    ];

    let filtered = allReceiving;
    if (domain) filtered = filtered.filter((r) => r.domain === domain);
    if (status) filtered = filtered.filter((r) => r.status === status);
    if (keyword) {
      filtered = filtered.filter(
        (r) =>
          r.id.includes(keyword) ||
          r.orderId.includes(keyword) ||
          r.supplier.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));

    res.json({ data, total: filtered.length, success: true });
  },

  'GET /api/procurement/receiving/:id/items': (_req: any, res: any) => {
    const items = [
      {
        id: '1',
        materialCode: 'M-10042-001',
        materialName: '注射用奥美拉唑钠（洛赛克）',
        spec: '40mg/支',
        unit: '支',
        brand: '阿斯利康',
        batchNo: '20250320',
        expireDate: '2027-03-01',
        manufacturer: '阿斯利康制药有限公司',
        orderedQty: 500,
        arrivedQty: 500,
        qualifiedQty: 500,
        udiCode: '6901234567890',
        result: 'qualified',
        remark: null,
      },
      {
        id: '2',
        materialCode: 'M-10088-002',
        materialName: '注射用头孢曲松钠',
        spec: '1g/瓶',
        unit: '瓶',
        brand: '罗氏',
        batchNo: '20250210',
        expireDate: '2026-02-01',
        manufacturer: '广州南新制药有限公司',
        orderedQty: 2000,
        arrivedQty: 2000,
        qualifiedQty: 2000,
        udiCode: '6909876543210',
        result: 'qualified',
        remark: null,
      },
      {
        id: '3',
        materialCode: 'M-20015-003',
        materialName: '0.9%氯化钠注射液',
        spec: '500ml/袋',
        unit: '袋',
        brand: '科伦',
        batchNo: '20250401',
        expireDate: '2026-10-01',
        manufacturer: '四川科伦药业股份有限公司',
        orderedQty: 3000,
        arrivedQty: 3000,
        qualifiedQty: 3000,
        udiCode: '6912233445566',
        result: 'qualified',
        remark: null,
      },
    ];
    res.json({ data: items, total: items.length, success: true });
  },

  'POST /api/procurement/receiving/:id/confirm': (_req: any, res: any) => {
    res.json({ success: true, message: '验收完成，已自动触发库存入库操作' });
  },
});
