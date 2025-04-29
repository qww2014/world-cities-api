/*
 * @Author: Lao Qiao
 * @Date: 2025-04-28 22:43:26
 * @LastEditTime: 2025-04-29 23:57:28
 * @LastEditors: Lao Qiao
 * @FilePath: /world-cities-api/worker.js
 * 我秃了，但我更强了~
 */
import cities from './cities.min.json';

// 辅助函数：处理城市名称
function normalizeCity(name) {
  if (!name) return '';
  // 转换为小写并移除多余空格
  return name.toLowerCase().trim();
}

// 查找城市所属的国家
function findCountryByCity(cityName) {
  const city = cities.find(item =>
    normalizeCity(item.city_ascii) === normalizeCity(cityName)
  );
  return city ? city.country : null;
}

// 获取同国家的其他城市
function getCitiesFromSameCountry(country, limit = 50) {
  return cities
    .filter(item => item.country === country)
    .sort((a, b) => {
      // 优先返回人口数较多的城市
      const popA = parseInt(a.population) || 0;
      const popB = parseInt(b.population) || 0;
      return popB - popA;
    })
    .slice(0, limit);
}

// 计算两个字符串的相似度
function similarity(s1, s2) {
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);

  // 计算共同单词数
  const commonWords = words1.filter(w => words2.includes(w));

  // 计算相似度分数
  return commonWords.length / Math.max(words1.length, words2.length);
}

export default {
  async fetch(request) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      const city = searchParams.get('city');
      const fallback = searchParams.get('fallback') === 'true';

      // 如果没有提供city参数
      if (!city) {
        return new Response(JSON.stringify({
          success: false,
          status: 400,
          message: '请提供city参数',
          count: 0,
          data: []
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      let results = cities;
      let responseStatus = 200;
      let responseMessage = '查询成功';
      let isFallback = false;

      const searchTerm = normalizeCity(city);

      // 使用city_ascii字段进行匹配
      results = cities.filter(item => {
        const cityAscii = normalizeCity(item.city_ascii);
        return cityAscii.includes(searchTerm);
      });

      // 按完全匹配优先排序
      results = results.sort((a, b) => {
        const aAscii = normalizeCity(a.city_ascii);
        const bAscii = normalizeCity(b.city_ascii);

        // 完全匹配排在最前面
        if (aAscii === searchTerm && bAscii !== searchTerm) return -1;
        if (aAscii !== searchTerm && bAscii === searchTerm) return 1;

        // 其次是开头匹配
        if (aAscii.startsWith(searchTerm) && !bAscii.startsWith(searchTerm)) return -1;
        if (!aAscii.startsWith(searchTerm) && bAscii.startsWith(searchTerm)) return 1;

        // 最后按字母顺序排序
        return aAscii.localeCompare(bAscii);
      });

      // 如果没有找到结果
      if (results.length === 0) {
        responseStatus = 404;
        responseMessage = '未找到匹配的城市';

        // 如果启用了fallback
        if (fallback) {
          const country = findCountryByCity(searchTerm);
          if (country) {
            results = getCitiesFromSameCountry(country);
            isFallback = true;
            responseStatus = 206;
            responseMessage = '未找到精确匹配的城市，返回同国家的其他城市';
          }
        }
      }

      return new Response(JSON.stringify({
        success: results.length > 0,
        status: responseStatus,
        message: responseMessage,
        count: results.length,
        isFallback: isFallback,
        data: results.slice(0, 50),
      }), {
        status: responseStatus,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        status: 500,
        message: error.message,
        count: 0,
        data: []
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  }
}