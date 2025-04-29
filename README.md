<!--

 * @Author: Lao Qiao
 * @Date: 2025-04-28 22:42:37
 * @LastEditTime: 2025-04-30 00:03:44
 * @LastEditors: Lao Qiao
 * @FilePath: /world-cities-api/README.md
 * 我秃了，但我更强了~
   -->

# world-cities-api

查询全球城市

### 接口请求方式

#### 1、精确搜索

```
?city=Beijing
```

#### 2、启用 fallback 搜索

```
?city=Beijing&fallback=true
```

## 返回结果

### 1、未提供 city 参数时：

```json
{
  "success": false,
  "status": 404,
  "message": "未找到匹配的城市",
  "count": 0,
  "data": []
}
```

### 2、正常搜索未找到结果时：

```json
{
  "success": true,
  "status": 206,  // 206表示返回的是备选城市
  "count": 数量,
  "isFallback": true,  // 表示这是备选结果
  "message": "未找到精确匹配的城市，返回同国家的其他城市",
  "data": [
    // 同国家的其他城市，按人口数排序
  ]
}
```

### 3、未找到结果但启用 fallback 且找到同国家城市时：

```json
{
  "success": true,
  "status": 200,
  "message": "查询成功",
  "count": 数量,
  "isFallback": false,
  "data": [...]
}
```

### 4、成功找到匹配结果时：

```json
{
  "success": true,
  "status": 200,
  "message": "查询成功",
  "count": 数量,
  "isFallback": false,
  "data": [...]
}
```

### 5、发生错误时：

```json
{
  "success": false,
  "status": 500,
  "message": "错误信息",
  "count": 0,
  "data": []
}
```

小意外：
通过让 ChatGPT 和 grok 还有 gemini 把 cities.min.json 生成中英文对照表发现

#### ChatGPT-4o 最有思路，一开始完成得很好，但是不爱费脑子，有的直接显示“翻译中”

![图片](https://laoqiao.oss-cn-beijing.aliyuncs.com/picgo/20250429003553.png?x-oss-process=style/shuiyin)

#### gemini-2.5pro 速度最快，而且全是中文，但是格式不对

![image-20250429003830358](https://laoqiao.oss-cn-beijing.aliyuncs.com/picgo/image-20250429003830358.png?x-oss-process=style/shuiyin)

最可气的是，主脑过载，情况不止一次！
![image-20250429003904130](https://laoqiao.oss-cn-beijing.aliyuncs.com/picgo/image-20250429003904130.png?x-oss-process=style/shuiyin)

#### grok3 准确高，都生成中文，也不偷懒显示“翻译中”，但是他就整一部分…（全部国家，他就只生成一个）

![image-20250429004237804](https://laoqiao.oss-cn-beijing.aliyuncs.com/picgo/image-20250429004237804.png?x-oss-process=style/shuiyin)

综合对比，对我感觉就是
ChatGPT-4o 老闺女（毕竟我给她的称呼是小美），不想干活就撒娇，还明目张胆的偷懒，你拿他没办法。
gemini-2.5pro 傲娇好学生，以不高兴直接给你撂担子，还特么退出账号！？
grok3 地主家傻儿子，能干肯干就是干不明白…
