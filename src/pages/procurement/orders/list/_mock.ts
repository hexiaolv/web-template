import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/orders': (req: any, res: any) => {
    const {
      status,
      supplier,
      domain,
      keyword,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allOrders = [
      {
        id: 'PO-20250602-001',
        planId: 'PL-202506-001',
        contractNo: 'CT-2025-018',
        supplier: '北京中科医疗器械有限公司',
        supplierContact: '刘志远',
        supplierPhone: '010-88886666',
        domain: 'consumable',
        branch: '主院区',
        creator: '李建国',
        createTime: '2025-06-02 10:00:00',
        requireDate: '2025-06-08',
        actualArriveDate: null,
        status: 'delivering',
        statusName: '已发货',
        itemCount: 8,
        totalAmount: 68500,
        receivedAmount: 0,
        pendingAmount: 68500,
        remark: '按计划PL-202506-001转化生成',
      },
      {
        id: 'PO-20250602-002',
        planId: 'PL-202506-001',
        contractNo: 'CT-2025-006',
        supplier: '浙江振德医疗用品有限公司',
        supplierContact: '陈思远',
        supplierPhone: '0571-88998899',
        domain: 'consumable',
        branch: '主院区',
        creator: '李建国',
        createTime: '2025-06-02 10:15:00',
        requireDate: '2025-06-07',
        actualArriveDate: '2025-06-06',
        status: 'received',
        statusName: '全部收货',
        itemCount: 5,
        totalAmount: 42000,
        receivedAmount: 42000,
        pendingAmount: 0,
        remark: null,
      },
      {
        id: 'PO-20250601-003',
        planId: 'PL-202506-003',
        contractNo: 'CT-2025-022',
        supplier: '国药控股广州有限公司',
        supplierContact: '黄建平',
        supplierPhone: '020-82228888',
        domain: 'medicine',
        branch: '主院区',
        creator: '赵晓丽',
        createTime: '2025-06-01 14:00:00',
        requireDate: '2025-06-05',
        actualArriveDate: '2025-06-04',
        status: 'partial',
        statusName: '部分收货',
        itemCount: 12,
        totalAmount: 185000,
        receivedAmount: 112000,
        pendingAmount: 73000,
        remark: '碘克沙醇暂时缺货，供应商预计6月8日补货',
      },
      {
        id: 'PO-20250603-004',
        planId: 'PL-202506-002',
        contractNo: 'CT-2025-031',
        supplier: '强生（上海）医疗器材有限公司',
        supplierContact: '王丽萍',
        supplierPhone: '021-63891234',
        domain: 'consumable',
        branch: '主院区',
        creator: '王秀芬',
        createTime: '2025-06-03 09:00:00',
        requireDate: '2025-06-06',
        actualArriveDate: null,
        status: 'confirmed',
        statusName: '供应商已确认',
        itemCount: 6,
        totalAmount: 128000,
        receivedAmount: 0,
        pendingAmount: 128000,
        remark: '紧急采购，强生骨科钛合金系列产品',
      },
      {
        id: 'PO-20250603-005',
        planId: null,
        contractNo: 'CT-2025-019',
        supplier: '百特（中国）投资有限公司',
        supplierContact: '方云鹏',
        supplierPhone: '010-65789900',
        domain: 'consumable',
        branch: '西院区',
        creator: '陈龙飞',
        createTime: '2025-06-03 15:30:00',
        requireDate: '2025-06-10',
        actualArriveDate: null,
        status: 'pending',
        statusName: '待确认',
        itemCount: 4,
        totalAmount: 36500,
        receivedAmount: 0,
        pendingAmount: 36500,
        remark: '西院区紧急补货，精密输液器、三通阀',
      },
      {
        id: 'PO-20250530-006',
        planId: 'PL-202505-012',
        contractNo: 'CT-2025-015',
        supplier: '上海医疗器械股份有限公司',
        supplierContact: '吴晓燕',
        supplierPhone: '021-64389900',
        domain: 'consumable',
        branch: '主院区',
        creator: '李建国',
        createTime: '2025-05-30 10:00:00',
        requireDate: '2025-06-03',
        actualArriveDate: '2025-06-02',
        status: 'received',
        statusName: '全部收货',
        itemCount: 15,
        totalAmount: 96500,
        receivedAmount: 96500,
        pendingAmount: 0,
        remark: null,
      },
      {
        id: 'PO-20250603-007',
        planId: 'PL-202506-006',
        contractNo: 'CT-2025-028',
        supplier: '扬子江药业集团有限公司',
        supplierContact: '李敏',
        supplierPhone: '0511-85679000',
        domain: 'medicine',
        branch: '西院区',
        creator: '孙晓明',
        createTime: '2025-06-03 17:00:00',
        requireDate: '2025-06-07',
        actualArriveDate: null,
        status: 'pending',
        statusName: '待确认',
        itemCount: 10,
        totalAmount: 67000,
        receivedAmount: 0,
        pendingAmount: 67000,
        remark: '西院区麻醉科专项，需提前联系到位',
      },
    ];

    let filtered = allOrders;
    if (domain) filtered = filtered.filter((o) => o.domain === domain);
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (supplier)
      filtered = filtered.filter((o) => o.supplier.includes(supplier));
    if (keyword) {
      filtered = filtered.filter(
        (o) =>
          o.id.includes(keyword) ||
          o.supplier.includes(keyword) ||
          (o.contractNo && o.contractNo.includes(keyword)),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));

    res.json({ data, total: filtered.length, success: true });
  },

  'GET /api/procurement/orders/:id/items': (_req: any, res: any) => {
    const items = [
      {
        id: '1',
        materialCode: 'C-20241-001',
        materialName: '一次性使用无菌注射器',
        spec: '10ml，带针，鲁尔滑动接头',
        unit: '支',
        brand: '江苏康辉',
        orderedQty: 30000,
        receivedQty: 0,
        unitPrice: 0.85,
        totalAmount: 25500,
        requireDate: '2025-06-08',
        batchNo: null,
        expireDate: null,
        remark: null,
      },
      {
        id: '2',
        materialCode: 'C-20163-002',
        materialName: '一次性使用无菌手术衣',
        spec: 'L号，SMS无纺布，防液体渗透',
        unit: '件',
        brand: '威格医疗',
        orderedQty: 800,
        receivedQty: 0,
        unitPrice: 38,
        totalAmount: 30400,
        requireDate: '2025-06-08',
        batchNo: null,
        expireDate: null,
        remark: null,
      },
      {
        id: '3',
        materialCode: 'C-51032-005',
        materialName: '医用检查手套（乳胶）',
        spec: 'M号，无粉，一次性使用',
        unit: '双',
        brand: '麦迪卡尔',
        orderedQty: 10000,
        receivedQty: 0,
        unitPrice: 0.72,
        totalAmount: 7200,
        requireDate: '2025-06-08',
        batchNo: null,
        expireDate: null,
        remark: null,
      },
    ];
    res.json({ data: items, total: items.length, success: true });
  },

  'POST /api/procurement/orders': (_req: any, res: any) => {
    res.json({ success: true, message: '采购订单创建成功' });
  },

  'POST /api/procurement/orders/:id/urge': (_req: any, res: any) => {
    res.json({ success: true, message: '催货通知已发送至供应商' });
  },

  'POST /api/procurement/orders/:id/receive': (_req: any, res: any) => {
    res.json({
      success: true,
      message: '已生成收货验收单',
      data: { receiveId: `RC-20250604-${Date.now().toString().slice(-3)}` },
    });
  },
});
