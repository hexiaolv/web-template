import { request } from '@umijs/max';

export interface GuideChatRequest {
  message: string;
  session_id?: string | null;
  title?: string | null;
}

export interface GuideSourceResponse {
  doc_name: string;
  excerpt: string;
  image_count: number;
}

export interface GuideImageResponse {
  name: string;
  media_type: string;
  content_base64?: string | null;
  object_ref: string;
  renderable: boolean;
  preview_message?: string | null;
}

export interface CitationResponse {
  chunk_id: string | null;
  file_id: string | null;
  file_name: string | null;
  version_id: string | null;
  version_no: number | null;
  snippet: string | null;
  char_start: number | null;
  char_end: number | null;
  score: number;
  page?: number | null;
}

export interface GuideChatResponse {
  session_id: string;
  message_id: string;
  mode: string;
  answer: string;
  thinking?: string | null;
  citations: CitationResponse[];
  sources: GuideSourceResponse[];
  images: GuideImageResponse[];
}

export async function queryGuideChat(data: GuideChatRequest) {
  // 由于跨域限制 (CORS)，生产环境也必须使用相对路径。
  // 请在部署的 Nginx 服务器中配置反向代理，将 /api/v1/ai/ 代理至 http://173.3.2.36:15050
  return request<GuideChatResponse>('/api/v1/ai/guide', {
    method: 'POST',
    data,
    timeout: 120000, // AI 请求较慢，延长超时时间至 120s
  });
}
