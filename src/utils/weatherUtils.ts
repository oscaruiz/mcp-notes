export interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function getCoordinates(city: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const data = await response.json();
    if (!data?.results?.length) return null;

    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}

export async function getWeather(latitude: number, longitude: number): Promise<any | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,is_day,rain&forecast_days=1`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}
