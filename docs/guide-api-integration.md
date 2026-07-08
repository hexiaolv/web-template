# DMS Guide 问答接口对接文档

## 1. 文档目的

本文档用于指导**未对接过该接口的前端项目、业务系统或第三方系统**接入 DMS 的 Guide 问答接口。

该接口面向“操作文档问答”场景：调用方传入自然语言问题，服务端基于本地操作手册文档返回：
- 回答正文
- 依据文档摘要
- 相关截图/图片

相关后端实现位置：
- 路由：[`guide_chat()`](../backend/app/api/routes/ai.py:71)
- 请求结构：[`GuideChatRequest`](../backend/app/schemas/ai.py:23)
- 响应结构：[`GuideChatResponse`](../backend/app/schemas/ai.py:66)

---

## 2. 接口概览

### 2.1 接口用途

适用于以下类型问题：
- SPD3.0 怎么收货
- 如何做入库
- 某个系统模块的操作步骤是什么
- 某个页面该如何填写

接口会尽量从本地 Guide 文档中检索相关内容，并返回：
1. `answer`：最终回答
2. `sources`：命中的文档摘要
3. `images`：与回答相关的截图或图片

### 2.2 接口地址

- 方法：`POST`
- 路径：[`/api/v1/ai/guide`](../backend/app/api/routes/ai.py:71)

完整 URL 示例：
```text
http://173.3.2.36:15050/api/v1/ai/guide
```

例如：
```text
http://127.0.0.1:15050/api/v1/ai/guide
```

### 2.3 鉴权说明

**事实**
- 当前 [`/guide`](../backend/app/api/routes/ai.py:71) 已改为**无用户 token 鉴权**。
- 请求时**不需要**携带 `Authorization: Bearer xxx`。

**建议**
- 现阶段可直接对接。
- 若后续面向更多系统开放，建议增加服务级鉴权，例如 API Key 或网关白名单。

---

## 3. 请求协议

请求体结构定义见 [`GuideChatRequest`](../backend/app/schemas/ai.py:23)。

### 3.1 请求头

```http
Content-Type: application/json
```

### 3.2 请求体字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| `message` | `string` | 是 | 用户问题，长度 1~4000 |
| `session_id` | `string \| null` | 否 | 会话 ID，建议调用方自定义并透传 |
| `title` | `string \| null` | 否 | 问题标题，最多 200 字 |

### 3.3 最小请求示例

```json
{
  "message": "SPD3.0 怎么收货"
}
```

### 3.4 推荐请求示例

```json
{
  "message": "SPD3.0 怎么收货",
  "session_id": "guide-session-001",
  "title": "SPD 收货问题"
}
```

---

## 4. 响应协议

响应结构定义见 [`GuideChatResponse`](../backend/app/schemas/ai.py:66)，其基础字段继承自 [`ChatResponse`](../backend/app/schemas/ai.py:57)。

### 4.1 顶层字段说明

| 字段 | 类型 | 说明 |
|---|---|---|
| `session_id` | `string` | 当前会话 ID |
| `message_id` | `string` | 当前消息 ID，当前固定为 `guide-message` |
| `mode` | `string` | 当前固定为 `operation_guide` |
| `answer` | `string` | 回答正文 |
| `thinking` | `string \| null` | 模型思考信息，可能为空 |
| `citations` | `array` | 当前 guide 场景下通常为空数组 |
| `sources` | `array` | 文档出处摘要 |
| `images` | `array` | 相关图片/截图 |

### 4.2 成功响应示例

```json
{
  "session_id": "guide-session-001",
  "message_id": "guide-message",
  "mode": "operation_guide",
  "answer": "直接结论：在 SPD3.0 中，收货通常进入对应收货功能后，按待收货记录逐步完成确认。\n\n操作步骤：...",
  "thinking": null,
  "citations": [],
  "sources": [
    {
      "doc_name": "SPD3.0用户操作手册（合集）.docx",
      "excerpt": "4.3.2.3 收货 ...",
      "image_count": 2
    }
  ],
  "images": [
    {
      "name": "image1.png",
      "media_type": "image/png",
      "content_base64": "iVBORw0KGgoAAA...",
      "object_ref": "word/media/image1.png",
      "renderable": true,
      "preview_message": null
    }
  ]
}
```

---

## 5. 重点字段说明

## 5.1 `answer`

字段位置：[`answer`](../backend/app/schemas/ai.py:61)

用于展示主回答内容。

**前端建议**
- 作为主内容区渲染
- 保留换行
- 不要依赖固定格式解析，按普通富文本/纯文本展示即可

---

## 5.2 `sources`

结构定义见 [`GuideSourceResponse`](../backend/app/schemas/ai.py:38)。

字段说明：

| 字段 | 类型 | 说明 |
|---|---|---|
| `doc_name` | `string` | 命中的文档名称 |
| `excerpt` | `string` | 命中的摘要片段 |
| `image_count` | `number` | 当前文档关联图片数 |

**前端建议**
- 放在“依据文档”区域展示
- 推荐展示：
  - 文档名
  - 摘要片段
  - 图片数量（可选）
- 如果摘要较长，可默认折叠，只显示前 120~200 个字符

---

## 5.3 `images`

结构定义见 [`GuideImageResponse`](../backend/app/schemas/ai.py:29)。

字段说明：

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | `string` | 图片名称 |
| `media_type` | `string` | MIME 类型，如 `image/png` |
| `content_base64` | `string \| null` | 图片 base64 内容 |
| `object_ref` | `string` | 对象引用或原始定位信息 |
| `renderable` | `boolean` | 是否可直接渲染 |
| `preview_message` | `string \| null` | 不能直接渲染时的提示信息 |

### 图片渲染规则

#### 情况 A：可直接渲染
满足以下条件时，可直接展示：
- `renderable === true`
- `content_base64` 有值

前端可按如下方式构造图片地址：

```ts
const src = `data:${image.media_type};base64,${image.content_base64}`;
```

#### 情况 B：不可直接渲染
以下情况不要强制渲染：
- `renderable === false`
- `content_base64` 为空

建议显示：
- 图片名
- [`preview_message`](../backend/app/schemas/ai.py:35)
- [`object_ref`](../backend/app/schemas/ai.py:33)

---

## 6. 接入示例

## 6.1 cURL 示例

```bash
curl -s -X POST http://127.0.0.1:15050/api/v1/ai/guide \
  -H "Content-Type: application/json" \
  -d '{
    "message": "SPD3.0 怎么收货",
    "session_id": "guide-session-001",
    "title": "SPD 收货问题"
  }'
```

格式化输出示例：

```bash
curl -s -X POST http://127.0.0.1:15050/api/v1/ai/guide \
  -H "Content-Type: application/json" \
  -d '{"message":"SPD3.0 怎么收货","session_id":"guide-session-001"}' | python3 -m json.tool
```

---

## 6.2 TypeScript 类型定义示例

前端可直接参考现有类型：
- [`GuideChatRequest`](../desktop/src/types/api.ts:199)
- [`GuideChatResponse`](../desktop/src/types/api.ts:205)

示例：

```ts
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
```

---

## 6.3 fetch 示例

```ts
export async function guideChat(baseUrl: string, payload: GuideChatRequest): Promise<GuideChatResponse> {
  const response = await fetch(`${baseUrl}/api/v1/ai/guide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Guide API failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<GuideChatResponse>;
}
```

---

## 6.4 axios 示例

```ts
import axios from 'axios';

export async function guideChat(baseUrl: string, payload: GuideChatRequest) {
  const { data } = await axios.post<GuideChatResponse>(
    `${baseUrl}/api/v1/ai/guide`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return data;
}
```

---

## 6.5 React 页面最小使用示例

```tsx
import { useState } from 'react';

export function GuideDemo() {
  const [message, setMessage] = useState('SPD3.0 怎么收货');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:15050/api/v1/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          session_id: 'external-system-demo',
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '查询中...' : '提交'}
      </button>

      {error ? <pre>{error}</pre> : null}

      {result ? (
        <div>
          <h3>回答</h3>
          <pre>{result.answer}</pre>

          <h3>依据文档</h3>
          {result.sources?.map((item: any, index: number) => (
            <div key={`${item.doc_name}-${index}`}>
              <strong>{item.doc_name}</strong>
              <div>{item.excerpt}</div>
            </div>
          ))}

          <h3>相关图片</h3>
          {result.images?.map((img: any, index: number) => (
            <div key={`${img.name}-${index}`}>
              <div>{img.name}</div>
              {img.renderable && img.content_base64 ? (
                <img
                  alt={img.name}
                  src={`data:${img.media_type};base64,${img.content_base64}`}
                  style={{ maxWidth: 480 }}
                />
              ) : (
                <div>{img.preview_message || '该图片当前不可直接预览'}</div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

---

## 7. 错误处理说明

## 7.1 HTTP 请求失败

如果接口返回非 200，前端应按异常处理：
- toast 提示
- 页面错误区展示
- 保留用户输入，支持重试

## 7.2 返回“证据不足”

字段位置：[`answer`](../backend/app/schemas/ai.py:61)

这种情况**不一定代表接口异常**，而可能是：
- 服务端未加载到 Guide 文档
- 当前问题在文档中没有足够依据

前端建议：
- 正常展示回答
- UI 上提示“未找到足够依据”
- 不要误判为系统崩溃

## 7.3 没有图片

`images` 为空是允许的。

前端不要因为没有图片就把当前问答判为失败。

---

## 8. 联调验收清单

对接完成后，至少验证以下内容：

1. 能成功调用 [`/api/v1/ai/guide`](../backend/app/api/routes/ai.py:71)
2. 调用时无需 token
3. 能拿到 HTTP 200
4. 能正确解析以下字段：
   - [`answer`](../backend/app/schemas/ai.py:61)
   - [`sources`](../backend/app/schemas/ai.py:67)
   - [`images`](../backend/app/schemas/ai.py:68)
5. 前端兼容以下三种返回场景：
   - 有回答、有出处、有图片
   - 有回答、有出处、无图片
   - 返回“证据不足”

---

## 9. 当前已知限制

**事实**
- 当前 Guide 能力依赖服务器本地 `assets` 目录中的 DOCX 文档。
- 如果线上未加载到文档，接口会返回“证据不足”。
- `thinking` 字段可能为空。
- `citations` 在当前 guide 场景中不是主要展示字段，主要使用 `sources` 与 `images`。

**建议**
- 前端页面主结构应围绕：
  - `answer`
  - `sources`
  - `images`
- 不要把 `thinking` 作为强依赖字段。

---

## 10. 一句话接入说明

外部系统向 [`POST /api/v1/ai/guide`](../backend/app/api/routes/ai.py:71) 发送 JSON：
- 必填 `message`
- 可选 `session_id`
- 可选 `title`

服务端返回 [`GuideChatResponse`](../backend/app/schemas/ai.py:66)，前端按 `answer + sources + images` 渲染即可；如果 `images` 中 `renderable=true` 且 `content_base64` 有值，则使用 `data:${media_type};base64,${content_base64}` 显示图片；如果回答为“证据不足”，按业务结果提示用户，不要当成接口异常。