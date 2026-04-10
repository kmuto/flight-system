FROM node:24-slim

WORKDIR /app

## パッケージ管理ファイルを先にコピーしてキャッシュを利用
COPY package*.json ./

RUN npm install

# ソースコードをコピー
COPY . .

# Viteのデフォルトポート
EXPOSE 5173

# ホストを0.0.0.0に指定しないとコンテナ外からアクセスできないため --host を付与
CMD ["npm", "run", "dev", "--", "--host"]
