import cities from './cities.min.json';

export default {
  async fetch(request) {
    try {
      const { searchParams } = new URL(request.url);
      const country = searchParams.get('country')?.toLowerCase();
      const city = searchParams.get('city')?.toLowerCase();

      let results = cities;

      if (country) {
        results = results.filter(item => item.country.toLowerCase().includes(country));
      }
      if (city) {
        results = results.filter(item => item.city.toLowerCase().includes(city));
      }

      return new Response(JSON.stringify({
        success: true,
        count: results.length,
        data: results.slice(0, 50),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}