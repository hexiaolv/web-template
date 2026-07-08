import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PushpinFilled,
  PushpinOutlined,
  RobotOutlined,
  SendOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Bubble, Conversations, Prompts, Sender } from '@ant-design/x';
import {
  Avatar,
  Button,
  Drawer,
  FloatButton,
  Image,
  Input,
  Layout,
  Modal,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { type GuideChatResponse, queryGuideChat } from './service';
import { type ChatMessage, useChatStorage } from './useChatStorage';

const { Paragraph, Text } = Typography;
const { Sider, Content } = Layout;

const loadingMessages = [
  '正在深度分析您的问题',
  '正在查阅业务知识库',
  '正在整理数据和记录',
  '正在为您生成详细解答',
];

const LoadingIndicator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : `${prev}.`));
    }, 500);
    return () => clearInterval(dotsTimer);
  }, []);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000); // Change message every 3 seconds
    return () => clearInterval(msgTimer);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: '#1677ff',
        fontSize: 14,
        fontStyle: 'italic',
        padding: '4px 0',
      }}
    >
      <RobotOutlined
        style={{
          marginRight: 8,
          fontSize: 16,
          animation: 'heartbeat 1.5s infinite',
        }}
      />
      <span>
        {loadingMessages[index]}
        {dots}
      </span>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 8px rgba(22,119,255,0.6); }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

const AiAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [managePromptsOpen, setManagePromptsOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const {
    sessions,
    prompts,
    addSession,
    updateSessionTitle,
    togglePinSession,
    deleteSession,
    getMessages,
    saveMessages,
    addPrompt,
    deletePrompt,
    updatePrompt,
  } = useChatStorage();

  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);

  // 恢复会话状态
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (activeSessionId) {
      const msgs = getMessages(activeSessionId);
      if (msgs.length === 0) {
        // 初始欢迎语
        const welcomeMsg: ChatMessage = {
          id: 'welcome',
          role: 'assistant',
          content:
            '您好！我是 SPD 助手，请问有什么可以帮您？例如：“SPD3.0 怎么收货”',
        };
        setCurrentMessages([welcomeMsg]);
      } else {
        setCurrentMessages(msgs);
      }
    }
  }, [activeSessionId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100);
    }
  }, [open, currentMessages]);

  const handleSend = async (val: string) => {
    const text = val.trim();
    if (!text || !activeSessionId) return;

    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const botMsgLoading: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: '',
      loading: true,
    };

    const newMsgs = [...currentMessages, userMsg, botMsgLoading];
    setCurrentMessages(newMsgs);

    // 如果是首条用户消息，使用前10个字更新会话标题
    const currentSession = sessions.find((s) => s.id === activeSessionId);
    if (
      currentSession &&
      (currentSession.title === '新会话' || currentSession.title === '默认会话')
    ) {
      updateSessionTitle(
        activeSessionId,
        text.substring(0, 10) + (text.length > 10 ? '...' : ''),
      );
    }

    setLoading(true);

    try {
      const res = await queryGuideChat({
        message: text,
        session_id: activeSessionId,
      });

      if (res?.answer) {
        const botMsgSuccess: ChatMessage = {
          id: botMsgLoading.id,
          role: 'assistant',
          content: res.answer,
          rawRes: res,
          loading: false,
        };
        const finalMsgs = [...currentMessages, userMsg, botMsgSuccess];
        setCurrentMessages(finalMsgs);
        saveMessages(activeSessionId, finalMsgs);
      } else {
        throw new Error('未获取到有效回答');
      }
    } catch (err: any) {
      const botMsgFail: ChatMessage = {
        id: botMsgLoading.id,
        role: 'assistant',
        content: `抱歉，服务器响应失败，请稍后重试。（${err.message || '未知错误'}）`,
        loading: false,
      };
      const finalMsgs = [...currentMessages, userMsg, botMsgFail];
      setCurrentMessages(finalMsgs);
      saveMessages(activeSessionId, finalMsgs);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newId = addSession();
    setActiveSessionId(newId);
  };

  const renderAssistantResponse = (msg: ChatMessage) => {
    if (msg.loading) {
      return <LoadingIndicator />;
    }

    const res = msg.rawRes as GuideChatResponse | undefined;
    const textContent = typeof msg.content === 'string' ? msg.content : '';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {textContent}
        </div>

        {/* 来源文档 */}
        {res?.sources && res.sources.length > 0 && (
          <div
            style={{
              marginTop: 8,
              background: '#f5f5f5',
              padding: '8px 12px',
              borderRadius: 8,
            }}
          >
            <Text type="secondary" strong style={{ fontSize: 12 }}>
              依据文档：
            </Text>
            {res.sources.map((src) => (
              <div
                key={
                  src.file_id ||
                  `${src.doc_name}-${src.excerpt.substring(0, 10)}`
                }
                style={{ marginTop: 4 }}
              >
                <Text style={{ fontSize: 12, color: '#1890ff' }}>
                  {src.doc_name}
                </Text>
                <Paragraph
                  ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                  style={{ fontSize: 12, marginBottom: 0, color: '#666' }}
                >
                  {src.excerpt}
                </Paragraph>
              </div>
            ))}
          </div>
        )}

        {/* 图片 */}
        {res?.images && res.images.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 8,
            }}
          >
            {res.images.map((img) => {
              if (img.renderable && img.content_base64) {
                return (
                  <Image
                    key={img.object_ref || img.name}
                    src={`data:${img.media_type};base64,${img.content_base64}`}
                    alt={img.name}
                    style={{
                      maxWidth: '100%',
                      borderRadius: 8,
                      border: '1px solid #f0f0f0',
                    }}
                  />
                );
              }
              return (
                <div
                  key={`img-err-${img.object_ref || img.name}`}
                  style={{
                    padding: 8,
                    background: '#fffbe6',
                    border: '1px solid #ffe58f',
                    borderRadius: 8,
                  }}
                >
                  <Text type="warning" style={{ fontSize: 12 }}>
                    图片[{img.name}]: {img.preview_message || '无法直接预览'}
                  </Text>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1; // 置顶靠前
      }
      return b.updatedAt - a.updatedAt; // 时间倒序
    });
  }, [sessions]);

  const conversationItems = sortedSessions.map((s) => ({
    key: s.id,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {editingSessionId === s.id ? (
          <Input
            size="small"
            value={editingTitle}
            autoFocus
            onChange={(e) => setEditingTitle(e.target.value)}
            onPressEnter={(e) => {
              e.stopPropagation();
              if (editingTitle.trim()) {
                updateSessionTitle(s.id, editingTitle.trim());
              }
              setEditingSessionId(null);
            }}
            onBlur={() => {
              if (editingTitle.trim()) {
                updateSessionTitle(s.id, editingTitle.trim());
              }
              setEditingSessionId(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, marginRight: 8 }}
          />
        ) : (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
            title={s.title}
          >
            {s.pinned && (
              <PushpinFilled style={{ color: '#1890ff', marginRight: 4 }} />
            )}
            {s.title}
          </span>
        )}

        {editingSessionId !== s.id && (
          <Space size={0} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="重命名">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined style={{ fontSize: 12 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTitle(s.title);
                  setEditingSessionId(s.id);
                }}
              />
            </Tooltip>
            <Tooltip title={s.pinned ? '取消置顶' : '置顶'}>
              <Button
                type="text"
                size="small"
                icon={<PushpinOutlined style={{ fontSize: 12 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinSession(s.id);
                }}
              />
            </Tooltip>
            <Tooltip title="删除会话">
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  const nextId = deleteSession(s.id);
                  if (activeSessionId === s.id) {
                    setActiveSessionId(nextId);
                  }
                }}
              />
            </Tooltip>
          </Space>
        )}
      </div>
    ),
  }));

  const promptItems = prompts.map((p) => ({
    key: p.id,
    description: p.text,
  }));

  return (
    <>
      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 48, height: 48 }}
        onClick={() => setOpen(true)}
        tooltip="AI 操作助手"
      />
      <Drawer
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff', fontSize: 20 }} />
            <span style={{ fontWeight: 600 }}>SPD AI助手</span>
          </Space>
        }
        placement="right"
        width={1200}
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<CloseOutlined />}
        styles={{
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        <Layout style={{ flex: 1, minHeight: 0, background: '#fff' }}>
          {/* 左侧历史与提示词 */}
          <Sider
            width={280}
            theme="light"
            style={{
              borderRight: '1px solid #f0f0f0',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div
              style={{
                padding: '16px 12px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <Button
                type="primary"
                block
                icon={<PlusOutlined />}
                onClick={handleNewChat}
                style={{ marginBottom: 16 }}
              >
                新建会话
              </Button>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  快捷提示词
                </Text>
                <Button
                  type="text"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => setManagePromptsOpen(true)}
                  style={{ fontSize: 12, color: '#888' }}
                >
                  管理
                </Button>
              </div>

              <div
                style={{ maxHeight: 150, overflowY: 'auto', marginBottom: 16 }}
              >
                <Prompts
                  items={promptItems}
                  onItemClick={(info) => {
                    handleSend(info.data.description as string);
                  }}
                  styles={{
                    item: {
                      padding: '8px 12px',
                      background: '#f5f5f5',
                      borderRadius: 8,
                      cursor: 'pointer',
                      marginBottom: 8,
                    },
                  }}
                />
              </div>

              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
                历史会话
              </Text>
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  marginLeft: -12,
                  marginRight: -12,
                }}
              >
                <Conversations
                  items={conversationItems}
                  activeKey={activeSessionId}
                  onActiveChange={(key) => setActiveSessionId(key)}
                />
              </div>
            </div>
          </Sider>

          {/* 右侧聊天区 */}
          <Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: '#f9f9f9',
              height: '100%',
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 16px 0 16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  width: '100%',
                }}
              >
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Bubble
                      placement={msg.role === 'user' ? 'end' : 'start'}
                      content={
                        msg.role === 'user'
                          ? msg.content
                          : renderAssistantResponse(msg)
                      }
                      avatar={
                        msg.role === 'user' ? (
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ background: '#87d068' }}
                          />
                        ) : (
                          <Avatar
                            icon={<RobotOutlined />}
                            style={{ background: '#1890ff' }}
                          />
                        )
                      }
                      styles={{
                        content: {
                          background: msg.role === 'user' ? '#1890ff' : '#fff',
                          color: msg.role === 'user' ? '#fff' : 'inherit',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          maxWidth: '100%',
                        },
                      }}
                    />
                    {/* 给用户发送的消息提供收藏按钮 */}
                    {msg.role === 'user' && typeof msg.content === 'string' && (
                      <div style={{ textAlign: 'right', marginTop: 4 }}>
                        <Button
                          type="link"
                          size="small"
                          icon={<StarOutlined />}
                          onClick={() => addPrompt(msg.content as string)}
                          style={{ fontSize: 12, padding: 0 }}
                        >
                          收藏提示词
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} style={{ height: 16 }} />
            </div>

            <div
              style={{
                padding: '16px',
                background: '#fff',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <Sender
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSend}
                loading={loading}
                placeholder="请描述您的问题，例如：如何入库..."
                submitType="shiftEnter"
                suffix={
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => handleSend(inputValue)}
                    loading={loading}
                    disabled={!inputValue.trim()}
                  />
                }
              />
            </div>
          </Content>
        </Layout>
      </Drawer>

      {/* 提示词管理弹窗 */}
      <Modal
        title="管理快捷提示词"
        open={managePromptsOpen}
        onCancel={() => setManagePromptsOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxHeight: 400,
            overflowY: 'auto',
            padding: '4px 0',
          }}
        >
          {prompts.map((p) => (
            <div
              key={p.id}
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
            >
              <Input
                value={p.text}
                onChange={(e) => updatePrompt(p.id, e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => deletePrompt(p.id)}
              />
            </div>
          ))}
          {prompts.length === 0 && (
            <div
              style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}
            >
              暂无提示词
            </div>
          )}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => addPrompt('新提示词')}
            style={{ marginTop: 8 }}
          >
            添加提示词
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AiAssistant;
