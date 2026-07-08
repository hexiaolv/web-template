import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: any; // ReactNode 或 string，本地存储只能序列化纯文本或对象
  rawRes?: any; // 存储完整响应对象，以便恢复带有图片和引用文档的富文本组件
  loading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  pinned: boolean;
}

export interface SavedPrompt {
  id: string;
  text: string;
}

const STORAGE_KEY_SESSIONS = 'spd_ai_sessions';
const STORAGE_KEY_PROMPTS = 'spd_ai_prompts';
const STORAGE_KEY_MESSAGES_PREFIX = 'spd_ai_msgs_';

export function useChatStorage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);

  // 初始加载
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      } else {
        // 创建一个默认会话
        const defaultSession: ChatSession = {
          id: `session-${Date.now()}`,
          title: '默认会话',
          updatedAt: Date.now(),
          pinned: false,
        };
        setSessions([defaultSession]);
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify([defaultSession]));
      }

      const storedPrompts = localStorage.getItem(STORAGE_KEY_PROMPTS);
      if (storedPrompts) {
        setPrompts(JSON.parse(storedPrompts));
      } else {
        // 提供一些默认快捷提示词
        const defaultPrompts = [
          { id: 'p1', text: 'SPD3.0 怎么收货' },
          { id: 'p2', text: '如何做入库' }
        ];
        setPrompts(defaultPrompts);
        localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(defaultPrompts));
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  const saveSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(newSessions));
  };

  const savePrompts = (newPrompts: SavedPrompt[]) => {
    setPrompts(newPrompts);
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(newPrompts));
  };

  // ----- 会话操作 -----
  const addSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: '新会话',
      updatedAt: Date.now(),
      pinned: false,
    };
    saveSessions([newSession, ...sessions]);
    return newSession.id;
  };

  const updateSessionTitle = (id: string, title: string) => {
    saveSessions(
      sessions.map((s) => (s.id === id ? { ...s, title, updatedAt: Date.now() } : s))
    );
  };

  const togglePinSession = (id: string) => {
    saveSessions(
      sessions.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const deleteSession = (id: string) => {
    const remain = sessions.filter((s) => s.id !== id);
    saveSessions(remain);
    localStorage.removeItem(STORAGE_KEY_MESSAGES_PREFIX + id);
    return remain.length > 0 ? remain[0].id : addSession();
  };

  // ----- 消息操作 -----
  const getMessages = (sessionId: string): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MESSAGES_PREFIX + sessionId);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveMessages = (sessionId: string, newMessages: ChatMessage[]) => {
    localStorage.setItem(STORAGE_KEY_MESSAGES_PREFIX + sessionId, JSON.stringify(newMessages));
    // 更新会话的修改时间
    saveSessions(
      sessions.map((s) => (s.id === sessionId ? { ...s, updatedAt: Date.now() } : s))
    );
  };

  // ----- 提示词操作 -----
  const addPrompt = (text: string) => {
    // 避免重复
    if (prompts.find((p) => p.text === text)) return;
    const newPrompt = { id: `prompt-${Date.now()}`, text };
    savePrompts([newPrompt, ...prompts]);
  };

  const deletePrompt = (id: string) => {
    savePrompts(prompts.filter((p) => p.id !== id));
  };

  const updatePrompt = (id: string, text: string) => {
    savePrompts(prompts.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  return {
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
  };
}
