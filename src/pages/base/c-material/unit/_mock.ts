import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/c-material/unit': (req: any, res: any) => {
    const { keyword, type, status, current = 1, pageSize = 10 } = req.query;

    const allItems = [
      {
        id: 'CU-001',
        code: 'U001',
        name: '只',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '只',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-002',
        code: 'U002',
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
        id: 'CU-003',
        code: 'U003',
        name: '双',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '双',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-004',
        code: 'U004',
        name: '套',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '套',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-005',
        code: 'U005',
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
        id: 'CU-006',
        code: 'U006',
        name: '块',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '块',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-007',
        code: 'U007',
        name: '根',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '根',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-008',
        code: 'U008',
        name: '卷',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '卷',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-009',
        code: 'U009',
        name: '把',
        type: 'base',
        typeName: '基本单位',
        conversionFactor: 1,
        baseUnitName: '把',
        status: 'active',
        statusName: '启用',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CU-010',
        code: 'U010',
        name: '箱',
        type: 'convert',
        typeName: '换算单位',
        conversionFactor: 50,
        baseUnitName: '只',
        status: 'active',
        statusName: '启用',
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

  'POST /api/base/c-material/unit': (_req: any, res: any) => {
    res.json({ success: true, message: '计量单位已保存' });
  },
});
