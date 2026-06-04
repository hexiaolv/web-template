import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/plan': (req: any, res: any) => {
    const {
      status,
      type,
      domain,
      keyword,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allPlans = [
      {
        id: 'PL-202506-001',
        name: '2025年6月耗材常规采购计划',
        type: 'regular',
        typeName: '常规计划',
        domain: 'consumable',
        branch: '主院区',
        creator: '李建国',
        createTime: '2025-06-01 09:15:00',
        approver: '张志强',
        approveTime: '2025-06-02 10:30:00',
        status: 'approved',
        statusName: '已审批',
        itemCount: 48,
        totalAmount: 285600,
        remark: '6月常规补货计划，覆盖ICU、手术室、普通病区常用耗材',
      },
      {
        id: 'PL-202506-002',
        name: '骨科手术室高值耗材紧急补货计划',
        type: 'urgent',
        typeName: '紧急计划',
        domain: 'consumable',
        branch: '主院区',
        creator: '王秀芬',
        createTime: '2025-06-02 14:20:00',
        approver: null,
        approveTime: null,
        status: 'pending',
        statusName: '待审批',
        itemCount: 12,
        totalAmount: 168000,
        remark: '钛合金锁定骨板库存告急，拟向国药集团紧急订购',
      },
      {
        id: 'PL-202506-003',
        name: '6月药品常规采购计划（西药类）',
        type: 'regular',
        typeName: '常规计划',
        domain: 'medicine',
        branch: '主院区',
        creator: '赵晓丽',
        createTime: '2025-06-01 10:00:00',
        approver: '周卫国',
        approveTime: '2025-06-02 16:00:00',
        status: 'purchased',
        statusName: '已采购',
        itemCount: 86,
        totalAmount: 542000,
        remark: '门诊及住院常规用药月度采购',
      },
      {
        id: 'PL-202506-004',
        name: '东院区医疗耗材临时补充计划',
        type: 'temp',
        typeName: '临时补货',
        domain: 'consumable',
        branch: '东院区',
        creator: '陈龙飞',
        createTime: '2025-06-03 08:30:00',
        approver: null,
        approveTime: null,
        status: 'draft',
        statusName: '草稿',
        itemCount: 8,
        totalAmount: 32000,
        remark: '东院区护士长反映一次性无菌手套库存不足',
      },
      {
        id: 'PL-202506-005',
        name: '6月放射科造影剂采购计划',
        type: 'regular',
        typeName: '常规计划',
        domain: 'medicine',
        branch: '主院区',
        creator: '林美华',
        createTime: '2025-05-30 11:00:00',
        approver: '周卫国',
        approveTime: '2025-06-01 09:00:00',
        status: 'purchased',
        statusName: '已采购',
        itemCount: 6,
        totalAmount: 198000,
        remark: '碘海醇、碘克沙醇等各类造影剂月度计划',
      },
      {
        id: 'PL-202505-012',
        name: '2025年5月耗材常规采购计划',
        type: 'regular',
        typeName: '常规计划',
        domain: 'consumable',
        branch: '主院区',
        creator: '李建国',
        createTime: '2025-05-01 09:00:00',
        approver: '张志强',
        approveTime: '2025-05-02 11:00:00',
        status: 'closed',
        statusName: '已关闭',
        itemCount: 52,
        totalAmount: 315000,
        remark: '5月份已完成全部采购',
      },
      {
        id: 'PL-202506-006',
        name: '西院区麻醉科专项药品补货计划',
        type: 'urgent',
        typeName: '紧急计划',
        domain: 'medicine',
        branch: '西院区',
        creator: '孙晓明',
        createTime: '2025-06-03 16:45:00',
        approver: null,
        approveTime: null,
        status: 'pending',
        statusName: '待审批',
        itemCount: 15,
        totalAmount: 89000,
        remark: '麻醉科丙泊酚、舒芬太尼等药品库存预警',
      },
    ];

    let filtered = allPlans;
    if (domain) filtered = filtered.filter((p) => p.domain === domain);
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (type) filtered = filtered.filter((p) => p.type === type);
    if (keyword) {
      filtered = filtered.filter(
        (p) =>
          p.name.includes(keyword) ||
          p.id.includes(keyword) ||
          p.creator.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));

    res.json({ data, total: filtered.length, success: true });
  },

  'GET /api/procurement/plan/:id/items': (_req: any, res: any) => {
    const items = [
      {
        id: '1',
        materialCode: 'C-20241-001',
        materialName: '一次性使用无菌注射器',
        spec: '10ml，带针，鲁尔滑动接头',
        unit: '支',
        brand: '江苏康辉',
        currentStock: 12000,
        safeStock: 20000,
        suggestQty: 30000,
        unitPrice: 0.85,
        totalAmount: 25500,
        supplier: '北京中科医疗器械有限公司',
      },
      {
        id: '2',
        materialCode: 'C-20163-002',
        materialName: '一次性使用无菌手术衣',
        spec: 'L号，SMS无纺布，防液体渗透',
        unit: '件',
        brand: '威格医疗',
        currentStock: 180,
        safeStock: 500,
        suggestQty: 800,
        unitPrice: 38,
        totalAmount: 30400,
        supplier: '广州医疗器械贸易有限公司',
      },
      {
        id: '3',
        materialCode: 'C-30045-003',
        materialName: '医用外科口罩',
        spec: '三层，独立包装，YY 0469-2011',
        unit: '只',
        brand: '振德医疗',
        currentStock: 8000,
        safeStock: 15000,
        suggestQty: 20000,
        unitPrice: 0.65,
        totalAmount: 13000,
        supplier: '浙江振德医疗用品有限公司',
      },
      {
        id: '4',
        materialCode: 'C-41087-004',
        materialName: '一次性使用输液器',
        spec: '带过滤器，精密过滤，0.2μm',
        unit: '套',
        brand: '百特医疗',
        currentStock: 5500,
        safeStock: 8000,
        suggestQty: 12000,
        unitPrice: 4.2,
        totalAmount: 50400,
        supplier: '百特（中国）投资有限公司',
      },
      {
        id: '5',
        materialCode: 'C-51032-005',
        materialName: '医用检查手套（乳胶）',
        spec: 'M号，无粉，一次性使用',
        unit: '双',
        brand: '麦迪卡尔',
        currentStock: 3200,
        safeStock: 6000,
        suggestQty: 10000,
        unitPrice: 0.72,
        totalAmount: 7200,
        supplier: '上海医疗器械股份有限公司',
      },
    ];
    res.json({ data: items, total: items.length, success: true });
  },

  'POST /api/procurement/plan': (_req: any, res: any) => {
    res.json({
      success: true,
      message: '采购计划创建成功',
      data: { id: `PL-202506-${Date.now().toString().slice(-3)}` },
    });
  },

  'PUT /api/procurement/plan/:id/approve': (_req: any, res: any) => {
    res.json({ success: true, message: '审批操作成功' });
  },

  'PUT /api/procurement/plan/:id/convert': (_req: any, res: any) => {
    res.json({
      success: true,
      message: '已成功转化为采购订单',
      data: { orderId: `PO-20250604-${Date.now().toString().slice(-3)}` },
    });
  },
});
