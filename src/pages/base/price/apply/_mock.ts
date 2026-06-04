import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/price/apply': (req: any, res: any) => {
    const {
      keyword,
      status,
      applicant,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allItems = [
      {
        id: 'PA-001',
        itemCode: 'HC20250001',
        itemName: '一次性使用医用口罩',
        spec: '17.5cm×9.5cm',
        supplierName: '浙江振德医疗用品有限公司',
        currentPrice: 0.45,
        newPrice: 0.42,
        changeRate: -6.7,
        changeReason: '原材料价格下降，供应商主动降价',
        applicant: '李建国',
        applyDate: '2025-05-20',
        status: 'approved',
        statusName: '已通过',
        approver: '张主任',
        approveDate: '2025-05-22',
        remark: '同意降价，新价格自6月1日起执行',
        createTime: '2025-05-20 09:00:00',
      },
      {
        id: 'PA-002',
        itemCode: 'YP20250005',
        itemName: '奥美拉唑肠溶胶囊',
        spec: '20mg×14粒',
        supplierName: '国药控股广州有限公司',
        currentPrice: 45,
        newPrice: 48.5,
        changeRate: 7.8,
        changeReason: '厂家调价，全国统一涨价',
        applicant: '王丽华',
        applyDate: '2025-06-01',
        status: 'pending',
        statusName: '待审批',
        approver: '',
        approveDate: '',
        remark: '待药事委员会审批',
        createTime: '2025-06-01 10:00:00',
      },
      {
        id: 'PA-003',
        itemCode: 'HC20250007',
        itemName: '导尿管',
        spec: '16Fr',
        supplierName: '上海康德莱企业发展集团股份有限公司',
        currentPrice: 12.5,
        newPrice: 11.8,
        changeRate: -5.6,
        changeReason: '年度协议续签优惠',
        applicant: '李建国',
        applyDate: '2025-05-15',
        status: 'approved',
        statusName: '已通过',
        approver: '张主任',
        approveDate: '2025-05-17',
        remark: '',
        createTime: '2025-05-15 09:00:00',
      },
      {
        id: 'PA-004',
        itemCode: 'YP20250010',
        itemName: '碘海醇注射液',
        spec: '100ml:30g(I)',
        supplierName: '通用电气药业（上海）有限公司',
        currentPrice: 128,
        newPrice: 145,
        changeRate: 13.3,
        changeReason: '进口原料成本上涨',
        applicant: '周国庆',
        applyDate: '2025-05-28',
        status: 'rejected',
        statusName: '已驳回',
        approver: '张主任',
        approveDate: '2025-05-30',
        remark: '涨幅过大，建议重新谈判或寻找替代供应商',
        createTime: '2025-05-28 14:00:00',
      },
      {
        id: 'PA-005',
        itemCode: 'HC20250009',
        itemName: '血管夹',
        spec: '中号',
        supplierName: '强生（上海）医疗器材有限公司',
        currentPrice: 28,
        newPrice: 26.5,
        changeRate: -5.4,
        changeReason: '集中采购量增大，争取更优价格',
        applicant: '赵伟',
        applyDate: '2025-06-02',
        status: 'pending',
        statusName: '待审批',
        approver: '',
        approveDate: '',
        remark: '',
        createTime: '2025-06-02 09:00:00',
      },
    ];

    let filtered = allItems;
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (applicant)
      filtered = filtered.filter((i) => i.applicant.includes(applicant));
    if (keyword) {
      filtered = filtered.filter(
        (i) => i.itemName.includes(keyword) || i.itemCode.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));
    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/base/price/apply': (_req: any, res: any) => {
    res.json({ success: true, message: '调价申请已提交' });
  },
});
