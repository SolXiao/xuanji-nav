
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

async function testNotion() {
  console.log("Testing Notion Integration...");
  console.log("Database ID:", databaseId);

  if (!process.env.NOTION_TOKEN) {
      console.error("Error: NOTION_TOKEN is missing in .env.local");
      return;
  }
  
  if (!databaseId) {
    console.error("Error: NOTION_DATABASE_ID is missing in .env.local");
    return;
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 1, // Fetch only one item to inspect structure
    });

    console.log("Successfully connected to Notion!");
    console.log(`Found ${response.results.length} results (showing 1).`);

    if (response.results.length > 0) {
      const page = response.results[0];
      console.log("First item properties structure:");
      console.log(JSON.stringify(page.properties, null, 2));
      
      console.log("\nFirst item icon structure:");
      console.log(JSON.stringify(page.icon, null, 2));
    } else {
        console.warn("Database is empty or no results found.");
    }

  } catch (error) {
    console.error("Failed to fetch from Notion:", error.body || error);
  }
}

testNotion();
