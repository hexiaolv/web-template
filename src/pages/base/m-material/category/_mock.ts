import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/m-material/category': (req: any, res: any) => {
    const { keyword, level, status, current = 1, pageSize = 10 } = req.query;

    const allItems = [
      {
        id: 'MC-001',
        code: 'M01',
        name: '抗微生物药',
        parentName: '—',
        level: 1,
        sort: 1,
        status: 'active',
        statusName: '启用',
        description: '抗生素、抗病毒、抗真菌等药物',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-002',
        code: 'M02',
        name: '麻醉药品',
        parentName: '—',
        level: 1,
        sort: 2,
        status: 'active',
        statusName: '启用',
        description: '临床麻醉及镇痛用药，需特殊管理',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-003',
        code: 'M03',
        name: '精神药品',
        parentName: '—',
        level: 1,
        sort: 3,
        status: 'active',
        statusName: '启用',
        description: '一类和二类精神药品，需专柜管理',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-004',
        code: 'M04',
        name: '心血管系统药',
        parentName: '—',
        level: 1,
        sort: 4,
        status: 'active',
        statusName: '启用',
        description: '降压药、抗心律失常药、抗心绞痛药等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-005',
        code: 'M05',
        name: '消化系统药',
        parentName: '—',
        level: 1,
        sort: 5,
        status: 'active',
        statusName: '启用',
        description: '抗酸药、促动力药、止泻药等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-006',
        code: 'M06',
        name: '内分泌系统药',
        parentName: '—',
        level: 1,
        sort: 6,
        status: 'active',
        statusName: '启用',
        description: '胰岛素、甲状腺药、肾上腺皮质激素等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-007',
        code: 'M01-01',
        name: 'β-内酰胺类',
        parentName: '抗微生物药',
        level: 2,
        sort: 1,
        status: 'active',
        statusName: '启用',
        description: '青霉素类、头孢菌素类等',
        createTime: '2025-01-05 00:00:00',
      },
      {
        id: 'MC-008',
        code: 'M07',
        name: '电解质补充药',
        parentName: '—',
        level: 1,
        sort: 7,
        status: 'active',
        statusName: '启用',
        description: '氯化钠、葡萄糖等输液制品',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-009',
        code: 'M08',
        name: '呼吸系统药',
        parentName: '—',
        level: 1,
        sort: 8,
        status: 'active',
        statusName: '启用',
        description: '祛痰药、止咳药、平喘药等',
        createTime: '2025-01-01 00:00:00',
      },
      {
        id: 'MC-010',
        code: 'M09',
        name: '诊断用药',
        parentName: '—',
        level: 1,
        sort: 9,
        status: 'disabled',
        statusName: '停用',
        description: '造影剂、诊断试剂等',
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

  'POST /api/base/m-material/category': (_req: any, res: any) => {
    res.json({ success: true, message: '分类已保存' });
  },
});
