import { z } from 'zod';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCoordinates, getWeather } from '../utils/weatherUtils.js';

export function registerFetchWeatherTool(server: McpServer): void {
  server.tool(
    'fetch-weather',
    'Tool to fetch the current weather of a given city',
    {
      city: z.string().describe('City name to look up'),
    },
    async ({ city }: { city: string }) => {
      const coordinates = await getCoordinates(city);
      if (!coordinates) {
        return {
          content: [{ type: 'text', text: `❌ Could not find geographic information for "${city}".` }],
        };
      }

      const weather = await getWeather(coordinates.latitude, coordinates.longitude);
      if (!weather?.current) {
        return {
          content: [{ type: 'text', text: `⚠️ Weather data unavailable for "${city}".` }],
        };
      }

      const { temperature_2m, precipitation, is_day, rain } = weather.current;

      return {
        content: [
          {
            type: 'text',
            text: `🌍 Current weather in ${city}:\n\n🌡️ Temperature: ${temperature_2m}°C\n🌧️ Rain: ${rain ? 'Yes' : 'No'}\n💧 Precipitation: ${precipitation} mm\n☀️ Daytime: ${is_day ? 'Yes' : 'No'}`,
          },
        ],
      };
    }
  );
}
