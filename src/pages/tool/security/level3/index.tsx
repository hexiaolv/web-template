import {
  DeleteOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  InputNumber,
  Popconfirm,
  Space,
  Switch,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';

const { Link, Text } = Typography;

// 本地存储 key
const STORAGE_KEY = 'security_level3_config';

// 截图默认值
const screenshotDefaults = {
  twoFactor: false,
  maxLoginAttempts: 30000000,
  lockDuration: 30,
  sessionTimeout: 600,
  passwordComplexity: true,
  passwordModifyInterval: 300,
  passwordHistoryLimit: 3,
  fileSafetyCheck: true,
  maxUploadSize: 10,
};

// 三级等保推荐默认配置
const level3Recommended = {
  twoFactor: true,
  maxLoginAttempts: 5,
  lockDuration: 30,
  sessionTimeout: 10,
  passwordComplexity: true,
  passwordModifyInterval: 3,
  passwordHistoryLimit: 3,
  fileSafetyCheck: true,
  maxUploadSize: 50,
};

const Level3SecurityConfig: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // 初始化加载配置
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        form.setFieldsValue(JSON.parse(saved));
      } catch (e) {
        console.error('加载等保配置失败:', e);
        form.setFieldsValue(screenshotDefaults);
      }
    } else {
      form.setFieldsValue(screenshotDefaults);
    }
  }, [form]);

  // 保存配置到本地
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      message.success('三级等保安全策略配置保存成功！');
    } catch (_e) {
      message.error('配置保存失败，请检查参数输入！');
    }
  };

  // 一键恢复合规的等保默认值
  const handleRestoreRecommended = () => {
    form.setFieldsValue(level3Recommended);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(level3Recommended));
    message.success('已恢复国家三级等保安全合规基准配置！');
  };

  // 清除所有配置
  const handleClearAll = () => {
    const cleared = {
      twoFactor: false,
      maxLoginAttempts: null,
      lockDuration: null,
      sessionTimeout: null,
      passwordComplexity: false,
      passwordModifyInterval: null,
      passwordHistoryLimit: null,
      fileSafetyCheck: false,
      maxUploadSize: null,
    };
    form.setFieldsValue(cleared);
    localStorage.removeItem(STORAGE_KEY);
    message.success('所有安全策略配置已被清空！');
  };

  return (
    <PageContainer
      title="三级等保设置"
      subTitle="配置并管理系统信息安全策略以符合国家信息安全等级保护（三级）规范"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* 三级等保政策警示与指引 */}
        <Alert
          message={<strong>三级等保：</strong>}
          description={
            <ol
              style={{
                paddingLeft: 18,
                margin: 0,
                color: '#4b5563',
                lineHeight: '22px',
              }}
            >
              <li>
                三级等保是中国国家等级保护认证中的最高级别认证，该认证包含了五个等级保护安全技术要求和五个安全管理要求，共涉及测评分类73类，要求非常严格。
              </li>
              <li>
                三级等保是地市级以上国家机关、重要企事业单位需要达成的认证，在金融行业中，可以看作是除了银行机构以外最高级别的安全等级保护。
              </li>
              <li>
                具体三级等保要求，请查看&quot;1024创新实验室&quot;写的相关文档{' '}
                <Link
                  href="https://github.com/chengyihua/print-designer"
                  target="_blank"
                >
                  三级等保文档
                </Link>
              </li>
            </ol>
          }
          type="info"
          showIcon
          icon={
            <SafetyCertificateOutlined
              style={{ fontSize: 24, color: '#1677ff' }}
            />
          }
          closable
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
            padding: '16px 24px',
          }}
        />

        {/* 表单核心区域 */}
        <Card
          title={<strong style={{ fontSize: 16 }}>三级等保配置</strong>}
          bordered={false}
          styles={{ body: { padding: '24px 32px' } }}
        >
          <Form
            form={form}
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 12 }}
            style={{ maxWidth: 800, margin: '0 auto' }}
          >
            {/* 1. 双因子登录 */}
            <Form.Item
              label="配置双因子登录模式"
              name="twoFactor"
              valuePropName="checked"
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  在用户登录时，需要同时提供用户名和密码以及其他形式的身份验证信息，例如短信验证码等
                </Text>
              }
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            {/* 2. 最大登录尝试次数 */}
            <Form.Item
              label="最大连续登录失败次数"
              name="maxLoginAttempts"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  连续登录失败超过一定次数，锁定账号。默认5次；0则不锁定。
                </Text>
              }
            >
              <InputNumber style={{ width: '100%' }} addonAfter="次" min={0} />
            </Form.Item>

            {/* 3. 锁定时间 */}
            <Form.Item
              label="连续登录失败锁定分钟"
              name="lockDuration"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  连续登录失败或强制锁定的时间。默认30分钟；0则不锁定。
                </Text>
              }
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="分钟"
                min={0}
              />
            </Form.Item>

            {/* 4. 超时退出 */}
            <Form.Item
              label="登录后无操作自动退出的分钟"
              name="sessionTimeout"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  登录后无任何操作自动退出登录状态。默认10分钟。
                </Text>
              }
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="分钟"
                min={0}
              />
            </Form.Item>

            {/* 5. 密码复杂度 */}
            <Form.Item
              label="开启密码复杂度"
              name="passwordComplexity"
              valuePropName="checked"
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  密码长度为8-20位且必须包含字母、数字、特殊符号（如
                  @#$%^&*()_+-=）等三种字符
                </Text>
              }
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            {/* 6. 定期修改密码间隔 */}
            <Form.Item
              label="定期修改密码时间间隔"
              name="passwordModifyInterval"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  定期强制要求修改密码的时间间隔。默认3个月。
                </Text>
              }
            >
              <InputNumber style={{ width: '100%' }} addonAfter="月" min={0} />
            </Form.Item>

            {/* 7. 重复密码限制 */}
            <Form.Item
              label="定期修改密码不允许重复次数"
              name="passwordHistoryLimit"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  定期修改密码时不允许使用重复密码。默认：3次以内密码不能相同。
                </Text>
              }
            >
              <InputNumber style={{ width: '100%' }} addonAfter="次" min={0} />
            </Form.Item>

            {/* 8. 文件检测 */}
            <Form.Item
              label="文件安全检测"
              name="fileSafetyCheck"
              valuePropName="checked"
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  对上传的文件类型、恶意文件内容进行安全检测（具体请看后端
                  SecurityFileService 类的 checkFile 方法）
                </Text>
              }
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            {/* 9. 上传大小限制 */}
            <Form.Item
              label="上传文件大小限制"
              name="maxUploadSize"
              rules={[{ required: true, message: '此项是必填项！' }]}
              extra={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  对上传文件的大小进行限制。默认 50 mb(兆)；0 表示不限制。
                </Text>
              }
            >
              <InputNumber
                style={{ width: '100%' }}
                addonAfter="mb(兆)"
                min={0}
              />
            </Form.Item>

            {/* 底部按钮栏 */}
            <Form.Item
              wrapperCol={{ offset: 7, span: 12 }}
              style={{ marginTop: 32 }}
            >
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{ minWidth: 100 }}
                >
                  保存配置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleRestoreRecommended}
                >
                  恢复三级等保默认配置
                </Button>
                <Popconfirm
                  title="确定清除所有配置吗？"
                  description="清除后所有安全参数将恢复为空态，可能会引发安全规范合规警报。"
                  onConfirm={handleClearAll}
                  okText="确定"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    清除所有配置
                  </Button>
                </Popconfirm>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Level3SecurityConfig;
