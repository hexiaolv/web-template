import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/c-material/category': (req: any, res: any) => {
    const { keyword, level, status, current = 1, pageSize = 10 } = req.query;

    const allItems = [
      {
        id: 'CC-001',
        code: 'C01',
        name: '防护类',
        parentName: '—',
        level: 1,
        sort: 1,
        status: 'active',
        statusName: '启用',
        description: '医用防护用品，包括口罩、手套、隔离衣等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-002',
        code: 'C02',
        name: '注射类',
        parentName: '—',
        level: 1,
        sort: 2,
        status: 'active',
        statusName: '启用',
        description: '注射器、注射针等注射相关耗材',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-003',
        code: 'C03',
        name: '输液类',
        parentName: '—',
        level: 1,
        sort: 3,
        status: 'active',
        statusName: '启用',
        description: '输液器、输液管、三通接头等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-004',
        code: 'C01-01',
        name: '口罩',
        parentName: '防护类',
        level: 2,
        sort: 1,
        status: 'active',
        statusName: '启用',
        description: '医用外科口罩、N95口罩等',
        createTime: '2025-01-05 00:00:00',
      },
      {
        id: 'CC-005',
        code: 'C01-02',
        name: '手套',
        parentName: '防护类',
        level: 2,
        sort: 2,
        status: 'active',
        statusName: '启用',
        description: '乳胶手套、丁腈手套、PE手套等',
        createTime: '2025-01-05 00:00:00',
      },
      {
        id: 'CC-006',
        code: 'C04',
        name: '骨科植入类',
        parentName: '—',
        level: 1,
        sort: 4,
        status: 'active',
        statusName: '启用',
        description: '骨板、骨钉、人工关节等骨科植入物',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-007',
        code: 'C05',
        name: '敷料类',
        parentName: '—',
        level: 1,
        sort: 5,
        status: 'active',
        statusName: '启用',
        description: '纱布、棉垫、创可贴、伤口敷料等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-008',
        code: 'C06',
        name: '导管类',
        parentName: '—',
        level: 1,
        sort: 6,
        status: 'active',
        statusName: '启用',
        description: '导尿管、引流管、中心静脉导管等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-009',
        code: 'C07',
        name: '监护类',
        parentName: '—',
        level: 1,
        sort: 7,
        status: 'active',
        statusName: '启用',
        description: '心电电极、血氧探头、血压袖带等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'CC-010',
        code: 'C08',
        name: '手术器械类',
        parentName: '—',
        level: 1,
        sort: 8,
        status: 'disabled',
        statusName: '停用',
        description: '一次性手术刀、血管夹、吻合器等',
        createTime: '2025-01-01 00:00:00',
      },
    ];

    let filtered = allItems;
    if (level) filtered = filtered.filter((i) => i.level === Number(level));
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

  'POST /api/base/c-material/category': (_req: any, res: any) => {
    res.json({ success: true, message: '分类已保存' });
  },
});
