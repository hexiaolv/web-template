import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/m-material/unit': (req: any, res: any) => {
    const { keyword, type, status, current = 1, pageSize = 10 } = req.query;

    const allItems = [
      {
        id: 'MU-001',
        code: 'U101',
        name: '片',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '片',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-002',
        code: 'U102',
        name: '支',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '支',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-003',
        code: 'U103',
        name: '瓶',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '瓶',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-004',
        code: 'U104',
        name: '盒',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '盒',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-005',
        code: 'U105',
        name: '袋',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '袋',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-006',
        code: 'U106',
        name: '粒',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '粒',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-007',
        code: 'U107',
        name: 'ml',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: 'ml',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-008',
        code: 'U108',
        name: 'g',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: 'g',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-009',
        code: 'U109',
        name: '板',
        type: 'convert',
        typeName: '换算单位',
        conversionFactor: 12,
        baseUnitName: '片',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MU-010',
        code: 'U110',
        name: '箱',
        type: 'convert',
        typeName: '换算单位',
        conversionFactor: 100,
        baseUnitName: '盒',
        status: 'disabled',
        statusName: '停用',
        createTime: '2025-01-01 00:00:00',
      },
    ];

    let filtered = allItems;
    if (type) filtered = filtered.filter((i) => i.type === type);
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (keyword) {
      filtered = filtered.filter(
        (i) => i.code.includes(keyword) || i.name.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));
    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/base/m-material/unit': (_req: any, res: any) => {
    res.json({ success: true, message: '计量单位已保存' });
  },
});
