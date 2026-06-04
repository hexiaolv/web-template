import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/supplier/certs': (req: any, res: any) => {
    const { keyword, certType, status, current = 1, pageSize = 10 } = req.query;

    const allItems = [
      {
        id: 'CERT-001',
        supplierName: '浙江振德医疗用品有限公司',
        certType: 'business_license',
        certTypeName: '营业执照',
        certNo: '91330600753456782K',
        certName: '营业执照（统一社会信用代码）',
        issueDate: '2020-01-15',
        expiryDate: '2040-01-14',
        issueOrg: '绍兴市市场监督管理局',
        status: 'valid',
        statusName: '有效',
        createTime: '2022-01-10 09:00:00',
      },
      {
        id: 'CERT-002',
        supplierName: '浙江振德医疗用品有限公司',
        certType: 'medical_device_license',
        certTypeName: '医疗器械生产许可证',
        certNo: '浙食药监械生产许20170036',
        certName: '医疗器械生产许可证',
        issueDate: '2022-03-01',
        expiryDate: '2027-02-28',
        issueOrg: '浙江省药品监督管理局',
        status: 'valid',
        statusName: '有效',
        createTime: '2022-03-05 10:00:00',
      },
      {
        id: 'CERT-003',
        supplierName: '国药控股广州有限公司',
        certType: 'business_license',
        certTypeName: '营业执照',
        certNo: '91440101716389456N',
        certName: '营业执照（统一社会信用代码）',
        issueDate: '2019-06-01',
        expiryDate: '2039-05-31',
        issueOrg: '广州市市场监督管理局',
        status: 'valid',
        statusName: '有效',
        createTime: '2021-05-20 09:00:00',
      },
      {
        id: 'CERT-004',
        supplierName: '国药控股广州有限公司',
        certType: 'gsp',
        certTypeName: 'GSP证书',
        certNo: 'GD-2021-0678',
        certName: '药品经营质量管理规范认证证书',
        issueDate: '2021-08-15',
        expiryDate: '2026-08-14',
        issueOrg: '广东省药品监督管理局',
        status: 'valid',
        statusName: '有效',
        createTime: '2021-08-20 10:00:00',
      },
      {
        id: 'CERT-005',
        supplierName: '宜昌人福药业有限责任公司',
        certType: 'narcotic_license',
        certTypeName: '麻醉药品生产许可证',
        certNo: '鄂麻药生许字2020003',
        certName: '麻醉药品和精神药品生产许可证',
        issueDate: '2023-01-01',
        expiryDate: '2025-12-31',
        issueOrg: '国家药品监督管理局',
        status: 'expiring',
        statusName: '即将过期',
        createTime: '2023-01-10 09:00:00',
      },
      {
        id: 'CERT-006',
        supplierName: '强生（上海）医疗器材有限公司',
        certType: 'medical_device_license',
        certTypeName: '医疗器械经营许可证',
        certNo: '沪食药监械经营许20180156',
        certName: '医疗器械经营许可证',
        issueDate: '2023-05-01',
        expiryDate: '2028-04-30',
        issueOrg: '上海市药品监督管理局',
        status: 'valid',
        statusName: '有效',
        createTime: '2023-05-10 09:00:00',
      },
      {
        id: 'CERT-007',
        supplierName: '江西洪达医疗器械集团有限公司',
        certType: 'gmp',
        certTypeName: 'GMP证书',
        certNo: 'JX-2019-0234',
        certName: '药品生产质量管理规范认证证书',
        issueDate: '2019-09-01',
        expiryDate: '2024-08-31',
        issueOrg: '江西省药品监督管理局',
        status: 'expired',
        statusName: '已过期',
        createTime: '2019-09-05 09:00:00',
      },
    ];

    let filtered = allItems;
    if (certType) filtered = filtered.filter((i) => i.certType === certType);
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (keyword) {
      filtered = filtered.filter(
        (i) =>
          i.supplierName.includes(keyword) ||
          i.certName.includes(keyword) ||
          i.certNo.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));
    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/base/supplier/certs': (_req: any, res: any) => {
    res.json({ success: true, message: '供应商证照已保存' });
  },
});
