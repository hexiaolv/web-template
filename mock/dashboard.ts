import type { Request, Response } from 'express';

// 初始模拟待办数据源
let mockTasks = [
  {
    id: 'TSK-2026-001',
    type: '审批',
    title: '科室请领单 REQ-0603-018 待审核',
    desc: '骨科手术室申请：钛合金锁定骨板4套，接骨螺钉40枚，定数耗材包10包。',
    branch: '主院区',
    domain: 'consumable',
    dept: '骨科手术室',
    status: 'pending',
    creator: '张美玲 (病区护士)',
    time: '2026-06-03 14:20',
  },
  {
    id: 'TSK-2026-002',
    type: '确认',
    title: '科室定数包配送任务 DEL-0603-041 待签收',
    desc: '主库房已送达：ICU重症监护科一次性使用呼吸机管路15套，无菌输液贴3盒。',
    branch: '主院区',
    domain: 'consumable',
    dept: 'ICU重症监护科',
    status: 'pending',
    creator: '系统自动生成',
    time: '2026-06-03 15:10',
  },
  {
    id: 'TSK-2026-003',
    type: '审批',
    title: '特管麻醉药品超额领用申请 REQ-0603-022 待复核',
    desc: 'ICU重症监护科超额请领：注射用盐酸瑞芬太尼 20支（超出本周消耗基数）。',
    branch: '主院区',
    domain: 'medicine',
    dept: 'ICU重症监护科',
    status: 'pending',
    creator: '王宏 (质控护士)',
    time: '2026-06-03 15:25',
  },
  {
    id: 'TSK-2026-004',
    type: '确认',
    title: '冷链温度传感器 HMD-012 设备异常告警待排除',
    desc: '外科病区2号医用冰箱：监测点温度持续高于 8.5°C 超过 20 分钟。',
    branch: '主院区',
    domain: 'medicine',
    dept: '外科病区',
    status: 'pending',
    creator: '自动采集终端',
    time: '2026-06-03 15:30',
  },
  {
    id: 'TSK-2026-005',
    type: '审批',
    title: '近效期低周转耗材报损单 LD-0527-003 待审批',
    desc: '骨科仓库发起报损：一次性负压引流袋一批，共 50 个（已过期）。',
    branch: '主院区',
    domain: 'consumable',
    dept: '骨科手术室',
    status: 'pending',
    creator: '李建国 (仓库管理员)',
    time: '2026-06-03 11:15',
  },
  {
    id: 'TSK-2026-006',
    type: '确认',
    title: '东院区手术包发货单 DEL-0603-092 待复核',
    desc: '东院区手术室配货：人工全膝关节假体组件 2 套发货确认。',
    branch: '东院区',
    domain: 'consumable',
    dept: '东区手术室',
    status: 'pending',
    creator: '东区主库',
    time: '2026-06-03 14:00',
  },
  {
    id: 'TSK-2026-007',
    type: '确认',
    title: '西院区急需急救用药配送 DEL-0603-102 待签收',
    desc: '西区药房配送：特殊急救针剂 10 盒送达。',
    branch: '西院区',
    domain: 'medicine',
    dept: '西区药房',
    status: 'pending',
    creator: '西区药库',
    time: '2026-06-03 13:45',
  },
];

// 初始消息数据
const mockMessages = [
  {
    id: 'MSG-001',
    category: 'system',
    title: '关于SPD平台2.0版本上线及数据库维护的通知',
    content: '系统将于今晚 24:00 至次日 02:00 进行数据库停机迁移维护，届时扫描枪与二级库终端将暂停数据同步，请做好离线消耗准备。',
    branch: 'all',
    domain: 'all',
    dept: 'all',
    time: '1小时前',
  },
  {
    id: 'MSG-002',
    category: 'biz',
    title: '主院区骨科手术室物资配送已送达',
    content: '您提交的“主院区 - 骨科手术室”消耗请领单配货已完毕，配送包已由物流员送达科室二级库房，请及时核实并签收。',
    branch: '主院区',
    domain: 'consumable',
    dept: '骨科手术室',
    time: '10分钟前',
  },
  {
    id: 'MSG-003',
    category: 'biz',
    title: '特管用药审批通过通知',
    content: 'ICU重症监护科申请的“注射用盐酸瑞芬太尼 20支”已经通过药剂科审核，物资已出库。',
    branch: '主院区',
    domain: 'medicine',
    dept: 'ICU重症监护科',
    time: '30分钟前',
  },
  {
    id: 'MSG-004',
    category: 'biz',
    title: '冷链监测预警警报',
    content: '外科病区2号医用冰箱：监测点温度持续高于 8.5°C，系统已通知设备科值班人员。',
    branch: '主院区',
    domain: 'medicine',
    dept: '外科病区',
    time: '15分钟前',
  },
  {
    id: 'MSG-005',
    category: 'system',
    title: '关于新增高值耗材入库规范培训的通知',
    content: '为贯彻执行集团 UDI 追溯规范，下周三下午将在多功能厅开展高值耗材入库扫码实操技能培训，请相关人员准时参会。',
    branch: 'all',
    domain: 'consumable',
    dept: 'all',
    time: '2小时前',
  },
];

// 初始预警数据
const mockAlarms = [
  {
    id: 'ALM-001',
    type: 'level-1', // 严重
    category: 'stock',
    title: '低库存预警：一次性无菌手术衣(大号)',
    desc: '骨科手术室：当前库存 12 套，已低于安全储备水位 50 套。',
    branch: '主院区',
    domain: 'consumable',
    dept: '骨科手术室',
    time: '5分钟前',
  },
  {
    id: 'ALM-002',
    type: 'level-2', // 中度
    category: 'cert',
    title: '供应商资质临期：北京医疗器械有限公司经营许可证',
    desc: '国药集团集团共享主数据：该供应商经营许可证将于 7 天后过期。',
    branch: '主院区',
    domain: 'consumable',
    dept: '全院',
    time: '1小时前',
  },
  {
    id: 'ALM-003',
    type: 'level-2', // 中度
    category: 'date',
    title: '药品效期预警：医用手套（批号 2024A012）',
    desc: 'ICU重症监护科药柜：该批次药品将于 15 天后失效，当前库存 800 双，请优先消耗。',
    branch: '主院区',
    domain: 'medicine',
    dept: 'ICU重症监护科',
    time: '2小时前',
  },
  {
    id: 'ALM-004',
    type: 'level-1', // 严重
    category: 'device',
    title: '设备温度异常预警：外科病区2号医用冰箱',
    desc: '外科病区药房：温度采集点高于上限 8.0°C (当前 8.7°C)。',
    branch: '主院区',
    domain: 'medicine',
    dept: '外科病区',
    time: '20分钟前',
  },
  {
    id: 'ALM-005',
    type: 'level-3', // 轻度
    category: 'stock',
    title: '高库存呆滞资产告警：钛合金锁定骨板',
    desc: '东院区手术室库房：周转天数已超 180 天，建议发起科室间调拨。',
    branch: '东院区',
    domain: 'consumable',
    dept: '东区手术室',
    time: '3小时前',
  },
];

export default {
  // 1. 首页业务分析指标
  'GET /api/dashboard/overview': (req: Request, res: Response) => {
    const branch = (req.query.branch as string) || '主院区';
    const domain = (req.query.domain as string) || 'consumable';
    const dept = (req.query.dept as string) || '全院';

    // 联动差异化数据
    let totalSpend = '¥242.5万';
    let turnDays = 12.4;
    let SatisfactionRate = 98.4;
    let trendData: { name: string; value: number }[] = [];

    if (branch === '东院区') {
      totalSpend = '¥84.2万';
      turnDays = 15.1;
      SatisfactionRate = 96.8;
      trendData = [
        { name: '周一', value: 120 },
        { name: '周二', value: 140 },
        { name: '周三', value: 165 },
        { name: '周四', value: 130 },
        { name: '周五', value: 180 },
        { name: '周六', value: 90 },
        { name: '周日', value: 70 },
      ];
    } else if (branch === '西院区') {
      totalSpend = '¥62.8万';
      turnDays = 18.2;
      SatisfactionRate = 95.2;
      trendData = [
        { name: '周一', value: 80 },
        { name: '周二', value: 95 },
        { name: '周三', value: 110 },
        { name: '周四', value: 85 },
        { name: '周五', value: 120 },
        { name: '周六', value: 60 },
        { name: '周日', value: 50 },
      ];
    } else {
      // 主院区
      totalSpend = domain === 'consumable' ? '¥268.4万' : '¥198.2万';
      turnDays = domain === 'consumable' ? 10.8 : 14.5;
      SatisfactionRate = domain === 'consumable' ? 99.1 : 97.5;
      trendData = [
        { name: '周一', value: 240 },
        { name: '周二', value: 280 },
        { name: '周三', value: 310 },
        { name: '周四', value: 290 },
        { name: '周五', value: 350 },
        { name: '周六', value: 180 },
        { name: '周日', value: 150 },
      ];
    }

    res.send({
      success: true,
      data: {
        totalSpend,
        turnDays,
        SatisfactionRate,
        trendData,
        branch,
        domain,
        dept,
      },
    });
  },

  // 2. 我的工作台信息加载
  'GET /api/dashboard/desk': (req: Request, res: Response) => {
    const branch = (req.query.branch as string) || '主院区';
    const domain = (req.query.domain as string) || 'consumable';
    const dept = (req.query.dept as string) || '全院';
    const userRole = (req.query.role as string) || 'admin';

    // 基础业务数据
    let metrics = {};
    if (userRole === 'nurse') {
      metrics = {
        title: '临床科室护士站物资管理面版',
        items: [
          { label: '今日扫码领用量', value: '42 件' },
          { label: '待签收配送单', value: '2 包' },
          { label: '库存低于水位线', value: '3 项' },
          { label: '已提领用申请', value: '1 笔' },
        ],
      };
    } else if (userRole === 'head') {
      metrics = {
        title: '科主任审批与业务核算面板',
        items: [
          { label: '待您审批申请', value: '2 项' },
          { label: '本科室月度领用额', value: '¥14.8万' },
          { label: '本月核销指标进度', value: '82%' },
          { label: '质控不合理项', value: '0 条' },
        ],
      };
    } else if (userRole === 'yangan') {
      metrics = {
        title: '物资冷链与效期质控面板',
        items: [
          { label: '待排除冷链预警', value: '1 项' },
          { label: '近效期处理中', value: '3 项' },
          { label: '效期已失效待处理', value: '1 项' },
          { label: '温湿度监测设备', value: '12 台' },
        ],
      };
    } else {
      // admin 
      metrics = {
        title: '全院医用物资统筹看板',
        items: [
          { label: '在途配送单数', value: '12 笔' },
          { label: '全院库存总值', value: domain === 'consumable' ? '¥84.2万' : '¥62.5万' },
          { label: '已核账结算单', value: '¥120.4万' },
          { label: '待处理结算异议', value: '1 笔' },
        ],
      };
    }

    res.send({
      success: true,
      data: {
        metrics,
        branch,
        domain,
        dept,
        role: userRole,
      },
    });
  },

  // 3. 消息列表接口
  'GET /api/dashboard/messages': (req: Request, res: Response) => {
    const branch = (req.query.branch as string) || '主院区';
    const domain = (req.query.domain as string) || 'consumable';
    const dept = (req.query.dept as string) || '全院';
    const userRole = (req.query.role as string) || 'admin';

    // 过滤隔离逻辑：
    // 系统公告全员可见，业务通知根据院区、业务域和科室隔离。
    const filtered = mockMessages.filter((msg) => {
      if (msg.branch !== 'all' && msg.branch !== branch) return false;
      if (msg.domain !== 'all' && msg.domain !== domain) return false;
      if (msg.dept !== 'all' && dept !== '全院' && msg.dept !== dept) return false;
      
      // 特管消息仅护士和科主任、质控可见
      if (msg.id === 'MSG-003' && userRole === 'admin') return false;
      return true;
    });

    res.send({
      success: true,
      data: filtered,
    });
  },

  // 4. 预警列表接口
  'GET /api/dashboard/alarms': (req: Request, res: Response) => {
    const branch = (req.query.branch as string) || '主院区';
    const domain = (req.query.domain as string) || 'consumable';
    const dept = (req.query.dept as string) || '全院';

    const filtered = mockAlarms.filter((alm) => {
      if (alm.branch !== branch) return false;
      if (alm.domain !== domain) return false;
      if (dept !== '全院' && alm.dept !== '全院' && alm.dept !== dept) return false;
      return true;
    });

    res.send({
      success: true,
      data: filtered,
    });
  },

  // 5. 待办列表接口
  'GET /api/dashboard/tasks': (req: Request, res: Response) => {
    const branch = (req.query.branch as string) || '主院区';
    const domain = (req.query.domain as string) || 'consumable';
    const dept = (req.query.dept as string) || '全院';
    const userRole = (req.query.role as string) || 'admin';

    // 根据角色和上下文多维度隔离待办：
    const filtered = mockTasks.filter((tsk) => {
      if (tsk.status !== 'pending') return false;
      if (tsk.branch !== branch) return false;
      if (tsk.domain !== domain) return false;
      
      // ICU 只能看 ICU 待办，骨科看骨科
      if (dept !== '全院' && tsk.dept !== dept) return false;

      // 角色职责过滤：
      if (userRole === 'nurse') {
        // 护士：配送确认签收
        return tsk.type === '确认';
      }
      if (userRole === 'head') {
        // 科主任：审批领用、报损等
        return tsk.type === '审批';
      }
      if (userRole === 'yangan') {
        // 质控：近效期和异常温湿度
        return tsk.id === 'TSK-2026-003' || tsk.id === 'TSK-2026-004';
      }
      // admin 可以查看全部（仅受限于院区和业务域）
      return true;
    });

    res.send({
      success: true,
      data: filtered,
    });
  },

  // 6. 处理待办接口
  'POST /api/dashboard/tasks/action': (req: Request, res: Response) => {
    const { id, action } = req.body; // action: 'approve' / 'reject' / 'confirm'

    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex > -1) {
      mockTasks[taskIndex].status = action === 'reject' ? 'rejected' : 'completed';
      
      // 联动减少其它地方计数
      res.send({
        success: true,
        message: '待办处理成功',
      });
      return;
    }

    res.send({
      success: false,
      message: '未找到该待办任务',
    });
  },
};
