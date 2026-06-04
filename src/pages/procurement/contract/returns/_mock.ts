import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/returns': (req: any, res: any) => {
    const { status, domain, keyword, current = 1, pageSize = 10 } = req.query;

    const allReturns = [
      {
        id: 'RT-20250603-001',
        orderId: 'PO-20250530-006',
        receiveId: 'RC-20250602-003',
        reason: 'quality',
        reasonName: '质量不合格',
        domain: 'consumable',
        branch: '主院区',
        supplier: '上海医疗器械股份有限公司',
        applier: '李建国',
        applyTime: '2025-06-03 10:00:00',
        approver: '张志强',
        approveTime: '2025-06-03 14:00:00',
        status: 'returned',
        statusName: '已退回',
        itemCount: 2,
        totalQty: 500,
        totalAmount: 360,
        logistics: '顺丰速运 SF9988001122',
        remark:
          '乳胶手套开封后发现部分产品存在破损，批号2025B0410共500双不合格',
      },
      {
        id: 'RT-20250602-002',
        orderId: 'PO-20250601-003',
        receiveId: 'RC-20250604-001',
        reason: 'expire',
        reasonName: '近效期退换',
        domain: 'medicine',
        branch: '主院区',
        supplier: '国药控股广州有限公司',
        applier: '赵晓丽',
        applyTime: '2025-06-02 09:30:00',
        approver: null,
        approveTime: null,
        status: 'pending',
        statusName: '待审批',
        itemCount: 1,
        totalQty: 50,
        totalAmount: 12500,
        logistics: null,
        remark:
          '注射用奥美拉唑40mg（批号20250115）效期2025-09-01，剩余不足3个月，申请退换',
      },
      {
        id: 'RT-20250604-003',
        orderId: 'PO-20250602-001',
        receiveId: null,
        reason: 'qty_diff',
        reasonName: '数量差异',
        domain: 'consumable',
        branch: '主院区',
        supplier: '北京中科医疗器械有限公司',
        applier: '王秀芬',
        applyTime: '2025-06-04 11:00:00',
        approver: null,
        approveTime: null,
        status: 'approved',
        statusName: '已审批',
        itemCount: 1,
        totalQty: 200,
        totalAmount: 7600,
        logistics: null,
        remark: '收货时发现注射器实收29800支，短少200支，供应商确认将补发',
      },
    ];

    let filtered = allReturns;
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

  'POST /api/procurement/returns': (_req: any, res: any) => {
    res.json({ success: true, message: '退货申请提交成功，等待审批' });
  },
});
