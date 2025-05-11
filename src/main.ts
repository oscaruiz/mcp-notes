import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerFetchWeatherTool } from './tools/fetchWeather.js';

// Create and configure the server
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0',
  port: 3000,
  host: 'localhost',
});

// Register tools
registerFetchWeatherTool(server);

// Start transport (stdio)
const transporter = new StdioServerTransport();
await server.connect(transporter);
