#!/bin/bash

# ==============================================================================
# 前端自动构建与部署脚本
# 
# 用法: 
#   ./deploy.sh [用户名] [服务器IP] [目标部署路径]
# 
# 示例: 
#   ./deploy.sh root 173.3.2.36 /var/www/html/spd-demo
#   docker exec e93e3a5783ae nginx -s reload
#
# 注意: 
#   1. 运行前请确保当前环境已安装 ssh/rsync。
#   2. 建议提前配置好 SSH 免密登录，否则在上传阶段会提示输入密码。
# ==============================================================================

# 您也可以在这里直接将默认值写死，这样以后直接运行 ./deploy.sh 即可
SERVER_USER=${1:-"dockerDeployer"}
SERVER_HOST=${2:-"10.20.20.238"}
SERVER_PORT=${3:-"22006"} # 修改为您的实际 SSH 端口
TARGET_DIR=${4:-"/home/dockerDeployer/docker/nginx/www/spd-demo/dist"}
SERVER_PASSWORD="spd_Test123456" # ⚠️ 临时写死的密码，请在此替换为您真实的密码

if ! command -v sshpass &> /dev/null; then
    echo "❌ 错误: 找不到 sshpass 工具。"
    echo "💡 在 Mac 上请打开一个新的终端窗口运行以下命令安装："
    echo "   brew install hudochenkov/sshpass/sshpass"
    echo "   安装完成后再重新运行此部署脚本。"
    exit 1
fi

echo "========================================"
echo "🚀 开始前端项目构建与部署"
echo "👤 目标用户: $SERVER_USER"
echo "🌐 目标主机: $SERVER_HOST"
echo "📂 目标路径: $TARGET_DIR"
echo "========================================"

# 1. 执行构建
echo "🔨 [1/2] 正在清理并构建项目 (pnpm build)..."
rm -rf src/.umi src/.umi-production node_modules/.cache
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查代码报错！部署已终止。"
    exit 1
fi
echo "✅ 构建成功！"

# 2. 同步文件到服务器
# 使用 rsync 进行增量同步，--delete 表示会删除目标服务器上旧版本独有而本地 dist 已没有的文件
echo "📤 [2/2] 正在通过 rsync 上传 dist 目录到服务器..."

# 确保服务器的目标父目录存在（防止 rsync 找不到路径报错）
sshpass -p "${SERVER_PASSWORD}" ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${TARGET_DIR}"

# 执行同步
sshpass -p "${SERVER_PASSWORD}" rsync -avz --delete -e "ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no" ./dist/ ${SERVER_USER}@${SERVER_HOST}:${TARGET_DIR}

if [ $? -eq 0 ]; then
    echo "========================================"
    echo "🎉 部署完成！"
    echo "🔗 您现在可以访问线上地址验证最新效果。"
    echo "========================================"
else
    echo "❌ 上传失败，请检查 SSH 账号权限或网络连接。"
    exit 1
fi
