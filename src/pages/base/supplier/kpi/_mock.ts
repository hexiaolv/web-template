import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/supplier/kpi': (req: any, res: any) => {
    const {
      keyword,
      evalPeriod,
      level,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allItems = [
      {
        id: 'KPI-001',
        supplierName: '浙江振德医疗用品有限公司',
        evalPeriod: '2025-Q1',
        deliveryRate: 98.5,
        qualityRate: 99.2,
        serviceScore: 95,
        overallScore: 97.6,
        rank: 1,
        level: 'excellent',
        levelName: '优秀',
        remark: '交货及时率高，产品质量稳定',
        createTime: '2025-04-10 09:00:00',
      },
      {
        id: 'KPI-002',
        supplierName: '国药控股广州有限公司',
        evalPeriod: '2025-Q1',
        deliveryRate: 96.8,
        qualityRate: 98.5,
        serviceScore: 92,
        overallScore: 95.8,
        rank: 2,
        level: 'excellent',
        levelName: '优秀',
        remark: '药品品种齐全，冷链管理规范',
        createTime: '2025-04-10 09:00:00',
      },
      {
        id: 'KPI-003',
        supplierName: '强生（上海）医疗器材有限公司',
        evalPeriod: '2025-Q1',
        deliveryRate: 95.2,
        qualityRate: 99.8,
        serviceScore: 90,
        overallScore: 95.0,
        rank: 3,
        level: 'excellent',
        levelName: '优秀',
        remark: '产品质量卓越，价格略高',
        createTime: '2025-04-10 09:00:00',
      },
      {
        id: 'KPI-004',
        supplierName: '山东威高集团医用高分子制品股份有限公司',
        evalPeriod: '2025-Q1',
        deliveryRate: 92.0,
        qualityRate: 97.5,
        serviceScore: 88,
        overallScore: 92.5,
        rank: 4,
        level: 'good',
        levelName: '良好',
        remark: '整体表现良好，个别批次延迟交货',
        createTime: '2025-04-10 09:00:00',
      },
      {
        id: 'KPI-005',
        supplierName: '宜昌人福药业有限责任公司',
        evalPeriod: '2025-Q1',
        deliveryRate: 94.5,
        qualityRate: 99.0,
        serviceScore: 85,
        overallScore: 92.8,
        rank: 5,
        level: 'good',
        levelName: '良好',
        remark: '麻醉药品管理严格，配送服务待提升',
        createTime: '2025-04-10 09:00:00',
      },
      {
        id: 'KPI-006',
        supplierName: '江西洪达医疗器械集团有限公司',
        evalPeriod: '2024-Q4',
        deliveryRate: 78.5,
        qualityRate: 85.0,
        serviceScore: 72,
        overallScore: 78.5,
        rank: 6,
        level: 'unqualified',
        levelName: '不合格',
        remark: '多次延迟交货，2批次产品抽检不合格，已终止合作',
        createTime: '2025-01-15 09:00:00',
      },
    ];

    let filtered = allItems;
    if (evalPeriod)
      filtered = filtered.filter((i) => i.evalPeriod === evalPeriod);
    if (level) filtered = filtered.filter((i) => i.level === level);
    if (keyword) {
      filtered = filtered.filter((i) => i.supplierName.includes(keyword));
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));
    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/base/supplier/kpi': (_req: any, res: any) => {
    res.json({ success: true, message: '绩效评估已保存' });
  },
});
