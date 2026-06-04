import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/qa': (req: any, res: any) => {
    const {
      status,
      type,
      domain,
      keyword,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allQa = [
      {
        id: 'QC-20250604-001',
        receiveId: 'RC-20250604-001',
        type: 'incoming',
        typeName: '进货检验',
        domain: 'medicine',
        branch: '主院区',
        inspector: '刘华强（质量管理科）',
        inspectDate: '2025-06-04',
        itemCount: 3,
        status: 'in_progress',
        statusName: '检验中',
        result: null,
        passCount: 2,
        failCount: 0,
        pendingCount: 1,
        remark: '碘造影剂专项检验，需外送检测机构',
      },
      {
        id: 'QC-20250602-002',
        receiveId: 'RC-20250602-002',
        type: 'routine',
        typeName: '常规抽检',
        domain: 'consumable',
        branch: '主院区',
        inspector: '张美丽（质检员）',
        inspectDate: '2025-06-06',
        itemCount: 5,
        status: 'qualified',
        statusName: '检验合格',
        result: 'qualified',
        passCount: 5,
        failCount: 0,
        pendingCount: 0,
        remark: '振德医疗口罩抽检10%，外观及密合性均合格',
      },
      {
        id: 'QC-20250602-003',
        receiveId: 'RC-20250602-003',
        type: 'incoming',
        typeName: '进货检验',
        domain: 'consumable',
        branch: '主院区',
        inspector: '张美丽（质检员）',
        inspectDate: '2025-06-02',
        itemCount: 15,
        status: 'unqualified',
        statusName: '发现不合格',
        result: 'unqualified',
        passCount: 13,
        failCount: 2,
        pendingCount: 0,
        remark:
          '乳胶手套2批次（批号2025B0410、2025B0411）拉伸强度不达标，已发起退货',
      },
      {
        id: 'QC-20250601-004',
        receiveId: null,
        type: 'special',
        typeName: '专项检查',
        domain: 'medicine',
        branch: '主院区',
        inspector: '周国庆（药剂科主任）',
        inspectDate: '2025-06-01',
        itemCount: 6,
        status: 'qualified',
        statusName: '检验合格',
        result: 'qualified',
        passCount: 6,
        failCount: 0,
        pendingCount: 0,
        remark: '麻醉药品专项抽查，含舒芬太尼、瑞芬太尼，均符合药典标准',
      },
    ];

    let filtered = allQa;
    if (domain) filtered = filtered.filter((q) => q.domain === domain);
    if (status) filtered = filtered.filter((q) => q.status === status);
    if (type) filtered = filtered.filter((q) => q.type === type);
    if (keyword) {
      filtered = filtered.filter(
        (q) =>
          q.id.includes(keyword) ||
          (q.receiveId && q.receiveId.includes(keyword)) ||
          q.inspector.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));

    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/procurement/qa': (_req: any, res: any) => {
    res.json({ success: true, message: '质检记录已创建' });
  },
});
