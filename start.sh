#!/bin/bash
echo "=========================================================="
echo "🎪 启动 DOTA2 暗黑狂欢 · 票券助手网页服务..."
echo "=========================================================="
PORT=8080
echo "网页访问地址: http://localhost:$PORT"
echo "按 Ctrl + C 可停止服务"
python3 -m http.server $PORT
