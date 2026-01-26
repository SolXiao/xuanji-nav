const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 60000, // Explicitly setting a longer timeout for testing
});

async function testConnection() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  console.log('Testing connection to Notion...');
  console.log('Database ID:', databaseId);

  if (!databaseId) {
    console.error('Error: NOTION_DATABASE_ID is missing in .env.local');
    process.exit(1);
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 1, // Just fetch one item to test connectivity
    });
    console.log('Success! Connection established.');
    console.log(`Found ${response.results.length} results.`);
  } catch (error) {
    console.error('Connection failed:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    process.exit(1);
  }
}

testConnection();
