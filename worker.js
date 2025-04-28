import cities from './cities.min.json';

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const searchParams = url.searchParams;

      if (path === '/countries') {
        // 提取所有国家名称
        const countriesSet = new Set();
        cities.forEach(item => {
          if (item.country) countriesSet.add(item.country);
        });
        const countries = Array.from(countriesSet).sort();

        return new Response(JSON.stringify({
          success: true,
          count: countries.length,
          countries: countries
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 其他路径，按原来逻辑处理城市查询
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