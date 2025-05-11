import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from 'zod'

// 1.Create Server
// MCP principal interface, it handles communication client-server
const server = new McpServer({
    name: 'Demo',
    version: '1.0.0',
    port: 3000,
    host: 'localhost'
})

// 2. Define tools
// Tools will allow the LLM to execute actions through our server.
server.tool(
  'fetch-weather', // Title
  'Tool to fetch the weather of a city', // Descritpion
  {
    city: z.string().describe('City name'), // Parameters
  },
  async ({ city }) => {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
  const data = await response.json()

  if (data.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: `No se encontró información para la ciudad ${city}`
        }
      ]
    }
  }

    const { latitude, longitude } = data.results[0];
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,precipitation,is_day,rain&forecast_days=1`)
    const weatherData = await weatherResponse.json()

     return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(weatherData, null, 2)
        }
      ]
    }
}
);


// 3. Litener
const transporter = new StdioServerTransport()
await server.connect(transporter);

// 4. MCP Inspector command, testing locally
// npx -y @modelcontextprotocol/inspector npx -y tsx main.ts