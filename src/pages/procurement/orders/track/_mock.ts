import { defineMock } from '@umijs/max';

export default defineMock({
  'GET /api/procurement/track': (req: any, res: any) => {
    const { status, domain, keyword, current = 1, pageSize = 10 } = req.query;

    const allTracks = [
      {
        id: 'SH-20250603-001',
        orderId: 'PO-20250602-001',
        supplier: '北京中科医疗器械有限公司',
        logisticsCompany: '中国邮政速递物流',
        trackingNo: 'EMS1234567890CN',
        domain: 'consumable',
        branch: '主院区',
        sendTime: '2025-06-03 14:30:00',
        estimatedArrival: '2025-06-05',
        actualArrival: null,
        status: 'in_transit',
        statusName: '运输中',
        itemDesc: '一次性无菌注射器、手术衣、手套等8个品种',
        sendQty: 5,
        contactPhone: '010-88886661',
        nodes: [
          {
            time: '2025-06-03 14:30',
            location: '北京顺义仓库',
            event: '货物已装车出库',
          },
          {
            time: '2025-06-03 17:20',
            location: '北京顺义分拨中心',
            event: '已完成揽收，进入运输流程',
          },
          {
            time: '2025-06-04 06:15',
            location: '郑州中转站',
            event: '中转站已接收货物，正在转运',
          },
        ],
      },
      {
        id: 'SH-20250601-002',
        orderId: 'PO-20250602-002',
        supplier: '浙江振德医疗用品有限公司',
        logisticsCompany: '德邦物流',
        trackingNo: 'DBL9988001234',
        domain: 'consumable',
        branch: '主院区',
        sendTime: '2025-06-01 10:00:00',
        estimatedArrival: '2025-06-03',
        actualArrival: '2025-06-06 09:30',
        status: 'arrived',
        statusName: '已到达',
        itemDesc: '医用外科口罩、无菌手套等5个品种',
        sendQty: 3,
        contactPhone: '0571-88998800',
        nodes: [
          {
            time: '2025-06-01 10:00',
            location: '绍兴柯桥工厂',
            event: '货物出库，交付德邦物流',
          },
          {
            time: '2025-06-01 16:30',
            location: '绍兴德邦中转站',
            event: '已接收货物',
          },
          {
            time: '2025-06-02 08:00',
            location: '上海配送中心',
            event: '中转中',
          },
          {
            time: '2025-06-03 14:00',
            location: '广州物流中心',
            event: '到达目的地城市',
          },
          {
            time: '2025-06-06 09:30',
            location: '广州市花都区医院收货站台',
            event: '货物已签收入库',
          },
        ],
      },
      {
        id: 'SH-20250603-003',
        orderId: 'PO-20250601-003',
        supplier: '国药控股广州有限公司',
        logisticsCompany: '自有配送车辆',
        trackingNo: 'GDGZ-20250603-045',
        domain: 'medicine',
        branch: '主院区',
        sendTime: '2025-06-03 07:00:00',
        estimatedArrival: '2025-06-04',
        actualArrival: '2025-06-04 10:15',
        status: 'arrived',
        statusName: '已到达',
        itemDesc: '注射用奥美拉唑、氯化钠注射液等10个品种（碘克沙醇未配送）',
        sendQty: 10,
        contactPhone: '020-82228889',
        nodes: [
          {
            time: '2025-06-03 07:00',
            location: '国药广州中心库',
            event: '药品出库，装冷链车',
          },
          {
            time: '2025-06-03 08:30',
            location: '广州市区在途',
            event: '冷链车辆正常行驶',
          },
          {
            time: '2025-06-04 10:15',
            location: '医院药库收货站',
            event: '药品到达，开始验收',
          },
        ],
      },
      {
        id: 'SH-20250604-004',
        orderId: 'PO-20250603-004',
        supplier: '强生（上海）医疗器材有限公司',
        logisticsCompany: '顺丰速运',
        trackingNo: 'SF7788990011',
        domain: 'consumable',
        branch: '主院区',
        sendTime: '2025-06-04 09:00:00',
        estimatedArrival: '2025-06-06',
        actualArrival: null,
        status: 'sent',
        statusName: '已发货',
        itemDesc: '钛合金锁定骨板、骨螺钉、钢板等骨科植入物6个品种',
        sendQty: 2,
        contactPhone: '021-63891235',
        nodes: [
          {
            time: '2025-06-04 09:00',
            location: '上海浦东仓库',
            event: '高值耗材已出库，严格清单核对完毕',
          },
          {
            time: '2025-06-04 11:30',
            location: '上海顺丰速运揽收点',
            event: '顺丰揽收确认',
          },
        ],
      },
      {
        id: 'SH-20250602-005',
        orderId: 'PO-20250530-006',
        supplier: '上海医疗器械股份有限公司',
        logisticsCompany: '百世快运',
        trackingNo: 'BSH20250602012',
        domain: 'consumable',
        branch: '主院区',
        sendTime: '2025-06-02 08:00:00',
        estimatedArrival: '2025-06-03',
        actualArrival: '2025-06-02 16:20',
        status: 'arrived',
        statusName: '已到达',
        itemDesc: '乳胶手套、棉签、绷带等15个品种',
        sendQty: 6,
        contactPhone: '021-64389901',
        nodes: [
          {
            time: '2025-06-02 08:00',
            location: '上海宝山仓库',
            event: '货物出库',
          },
          {
            time: '2025-06-02 12:30',
            location: '广州百世中转站',
            event: '快速中转',
          },
          {
            time: '2025-06-02 16:20',
            location: '医院仓库收货区',
            event: '货物已到达并签收',
          },
        ],
      },
    ];

    let filtered = allTracks;
    if (domain) filtered = filtered.filter((t) => t.domain === domain);
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (keyword) {
      filtered = filtered.filter(
        (t) =>
          t.id.includes(keyword) ||
          t.orderId.includes(keyword) ||
          t.trackingNo.includes(keyword) ||
          t.supplier.includes(keyword),
      );
    }

    const start = (Number(current) - 1) * Number(pageSize);
    const data = filtered.slice(start, start + Number(pageSize));

    res.json({ data, total: filtered.length, success: true });
  },

  'POST /api/procurement/track/:id/urge': (_req: any, res: any) => {
    res.json({ success: true, message: '催货消息已推送至供应商负责人' });
  },
});
