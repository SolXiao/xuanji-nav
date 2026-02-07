const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 1. 加载环境变量
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ 发现 .env.local 文件');
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  console.error('❌ 未找到 .env.local 文件！请确保项目根目录下存在该文件。');
  process.exit(1);
}

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

console.log('\n--- 环境变量检查 ---');
if (apiKey) {
  console.log(`✅ NOTION_API_KEY 已设置 (长度: ${apiKey.length}, 前缀: ${apiKey.substring(0, 4)}***)`);
} else {
  console.error('❌ NOTION_API_KEY 未设置！');
}

if (databaseId) {
  console.log(`✅ NOTION_DATABASE_ID 已设置 (ID: ${databaseId})`);
} else {
  console.error('❌ NOTION_DATABASE_ID 未设置！');
}

if (!apiKey || !databaseId) {
  console.error('\n请在 .env.local 中补充缺失的变量。');
  process.exit(1);
}

// 2. 初始化 Notion 客户端
const notion = new Client({ auth: apiKey });

// 3. 测试连接
async function testConnection() {
  console.log('\n--- Notion API 连接测试 ---');
  try {
    // 步骤 A: 验证 Token 是否有效 (通过列出用户)
    console.log('1️⃣ 正在验证 API Token...');
    const users = await notion.users.list({});
    console.log('✅ API Token 有效！连接成功。');

    // 步骤 B: 验证是否能访问数据库
    console.log(`2️⃣ 正在查询数据库 (ID: ${databaseId})...`);
    const db = await notion.databases.retrieve({ database_id: databaseId });
    console.log(`✅ 成功访问数据库！`);
    console.log(`   数据库名称: ${db.title[0]?.plain_text || '未命名'}`);
    console.log(`   最后编辑时间: ${db.last_edited_time}`);

    console.log('\n🎉 配置验证通过！您的 Notion 连接设置正确。');

  } catch (error) {
    if (error.code === 'object_not_found') {
      console.error('❌ 找不到数据库。');
      console.error('   原因: 数据库 ID 错误，或者未将 Integration 邀请到该数据库。');
      console.error('   解决: 请在 Notion 数据库页面右上角点击 "..." -> "Add connections" -> 选择您的 Integration。');
    } else if (error.code === 'unauthorized') {
      console.error('❌ API Token 无效。');
      console.error('   解决: 请检查 NOTION_API_KEY 是否正确复制，确保没有多余空格。');
    } else {
      console.error('❌ 连接失败:', error.message);
      console.error('   错误代码:', error.code);
    }
  }
}

testConnection();
