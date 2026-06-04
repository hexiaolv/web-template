import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/base/supplier/profile': (req: any, res: any) => {
    const {
      keyword,
      cooperationStatus,
      rating,
      current = 1,
      pageSize = 10,
    } = req.query;

    const allItems = [
      {
        id: 'SP-001',
        code: 'SUP20250001',
        name: '浙江振德医疗用品有限公司',
        shortName: '振德医疗',
        legalPerson: '鲁建国',
        registeredCapital: '50000万元',
        contactPerson: '陈思远',
        contactPhone: '0571-88998899',
        email: 'chenSY@zhende.com',
        address: '浙江省绍兴市越城区振德路1号',
        businessScope: '医用敷料、手术耗材、防护用品',
        cooperationStatus: 'active',
        cooperationStatusName: '合作中',
        rating: 'A',
        cooperationStartDate: '2022-01-15',
        cooperationEndDate: '2027-01-14',
        createTime: '2022-01-10 09:00:00',
      },
      {
        id: 'SP-002',
        code: 'SUP20250002',
        name: '国药控股广州有限公司',
        shortName: '国药广州',
        legalPerson: '刘明',
        registeredCapital: '100000万元',
        contactPerson: '王丽华',
        contactPhone: '020-86668888',
        email: 'wanglh@sinopharm-gz.com',
        address: '广州市白云区同德街西槎路629号',
        businessScope: '药品批发、医疗器械、中药材',
        cooperationStatus: 'active',
        cooperationStatusName: '合作中',
        rating: 'A',
        cooperationStartDate: '2021-06-01',
        cooperationEndDate: '2026-05-31',
        createTime: '2021-05-20 09:00:00',
      },
      {
        id: 'SP-003',
        code: 'SUP20250003',
        name: '山东威高集团医用高分子制品股份有限公司',
        shortName: '威高集团',
        legalPerson: '陈学利',
        registeredCapital: '80000万元',
        contactPerson: '赵伟',
        contactPhone: '0631-5622888',
        email: 'zhaowei@wego.com',
        address: '山东省威海市环翠区旅游度假区威高路1号',
        businessScope: '一次性医疗器械、骨科产品、血液净化',
        cooperationStatus: 'active',
        cooperationStatusName: '合作中',
        rating: 'B',
        cooperationStartDate: '2023-03-01',
        cooperationEndDate: '2026-02-28',
        createTime: '2023-02-15 09:00:00',
      },
      {
        id: 'SP-004',
        code: 'SUP20250004',
        name: '强生（上海）医疗器材有限公司',
        shortName: '强生医疗',
        legalPerson: 'Ahsan Zafar',
        registeredCapital: '30000万元',
        contactPerson: '李明',
        contactPhone: '021-38663866',
        email: 'liming@its.jnj.com',
        address: '上海市浦东新区东捷路99号',
        businessScope: '手术器材、骨科植入物、心血管介入',
        cooperationStatus: 'active',
        cooperationStatusName: '合作中',
        rating: 'A',
        cooperationStartDate: '2020-08-01',
        cooperationEndDate: '2027-07-31',
        createTime: '2020-07-15 09:00:00',
      },
      {
        id: 'SP-005',
        code: 'SUP20250005',
        name: '宜昌人福药业有限责任公司',
        shortName: '人福药业',
        legalPerson: '李杰',
        registeredCapital: '30000万元',
        contactPerson: '张强',
        contactPhone: '0717-6779810',
        email: 'zhangq@humanwell.com.cn',
        address: '湖北省宜昌市东苑路9号',
        businessScope: '麻醉药品、精神药品、化学制剂',
        cooperationStatus: 'active',
        cooperationStatusName: '合作中',
        rating: 'A',
        cooperationStartDate: '2022-05-01',
        cooperationEndDate: '2025-04-30',
        createTime: '2022-04-10 09:00:00',
      },
      {
        id: 'SP-006',
        code: 'SUP20250006',
        name: '江西洪达医疗器械集团有限公司',
        shortName: '洪达医疗',
        legalPerson: '吴建华',
        registeredCapital: '15000万元',
        contactPerson: '周芳',
        contactPhone: '0791-8588888',
        email: 'zhoufang@hongda-med.com',
        address: '江西省南昌市进贤县医疗器械产业园',
        businessScope: '一次性注射器、输液器、采血管',
        cooperationStatus: 'terminated',
        cooperationStatusName: '已终止',
        rating: 'C',
        cooperationStartDate: '2021-01-01',
        cooperationEndDate: '2024-12-31',
        createTime: '2020-12-15 09:00:00',
      },
      {
        id: 'SP-007',
        code: 'SUP20250007',
        name: '大博医疗科技股份有限公司',
        shortName: '大博医疗',
        legalPerson: '林志雄',
        registeredCapital: '42000万元',
        contactPerson: '黄志强',
        contactPhone: '0592-5762888',
        email: 'huangzq@doublemedical.com',
        address: '福建省厦门市海沧区新阳街道新园路130号',
        businessScope: '骨科植入物、创伤固定系统、脊柱内固定',
        cooperationStatus: 'pending',
        cooperationStatusName: '待审核',
        rating: 'B',
        cooperationStartDate: '',
        cooperationEndDate: '',
        createTime: '2025-05-20 09:00:00',
      },
    ];

    let filtered = allItems;
    if (cooperationStatus)
      filtered = filtered.filter(
        (i) => i.cooperationStatus === cooperationStatus,
      );
    if (rating) filtered = filtered.filter((i) => i.rating === rating);
    if (keyword) {
      filtered = filtered.filter(
        (i) =>
          i.code.includes(keyword) ||
          i.name.includes(keyword) ||
          i.shortName.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));
    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/base/supplier/profile': (_req: any, res: any) => {
    res.json({ success: true, message: '供应商档案已保存' });
  },
});
