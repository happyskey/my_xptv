// 创建一个 cheerio 实例，用于解析 HTML 内容
const cheerio = createCheerio()

// 定义一个 User-Agent 字符串，用于模拟浏览器请求
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

// 定义请求头，模拟浏览器请求，避免被反爬虫机制屏蔽
const headers = {
  'Referer': 'https://ddys.pro/', // Referer header，标明请求的来源
  'Origin': 'https://ddys.pro',  // Origin header，标明请求的起源
  'User-Agent': UA,              // User-Agent header，模拟浏览器访问
}

// 定义应用的配置，包括网站信息和分类
const appConfig = {
    ver: 1,
    title: '桃子影视',
    site: 'https://www.taozi008.com',
    // 定義分類
    tabs: [
        // name 為分類名，ext 可以傳入任意參數由 getCards 接收
        {
            name: '電影',
            ext: {
                id: 229,
            },
        },
        {
            name: '连续剧',
            ext: {
                id: 230,
            },
        },
        {
            name: '综艺',
            ext: {
                id: 231,
            },
        },
        {
            name: '动漫',
            ext: {
                id: 232,
            },
        },
    ],
}

// 获取应用配置的函数
async function getConfig() {
    return jsonify(appConfig)  // 返回应用的配置 JSON
}

// 获取影片卡片的函数，ext 包含额外的请求参数（如分页信息）
async function getCards(ext) {
  ext = argsify(ext)  // 解析扩展参数
  let cards = []  // 用于存储抓取到的影片卡片
  let url = ext.url  // 获取请求的 URL
  let page = ext.page || 1  // 获取当前页面（默认是第1页）
  let hasMore = ext.hasMore || true  // 是否有更多内容（默认为 true）

  if (!hasMore && page > 1) {
    return jsonify({
      list: cards,  // 如果没有更多内容且当前页面大于1，返回空卡片列表
    })
  }

  const url = appConfig.site +`/vod/index.html?page=2&type_id=230` //`/vod/index.html?${page}&type_id=${id}`//`/index.php/vod/show/id/${id}/page/${page}.html`

  const { data } = await $fetch.get(url, {
  //  headers  // 使用上面定义的请求头发送 GET 请求
  })

  const $ = cheerio.load(data)  // 使用 cheerio 解析返回的 HTML 数据
  $('article.post').each((_, each) => {  // 遍历每个文章（影片）节点
    cards.push({
      vod_id: $(each).find('h2 > a').attr('href'),  // 获取影片的 URL
      vod_name: $(each).find('h2.post-box-title').text(),  // 获取影片的标题
      vod_pic: $(each).find('.post-box-image').attr('style').replace('background-image: url(', '').replace('");"', ''),  // 获取影片的封面图片
      vod_remarks: $(each).find('div.post-box-text > p').text(),  // 获取影片的备注信息
    })
  })

  return jsonify({
    list: cards,  // 返回抓取到的影片卡片列表
  })
}

// 获取播放信息的函数
async function getPlayinfo(ext) {
    ext = argsify(ext)  // 解析扩展参数
    const { srctype, src0, } = ext  // 获取视频源类型和源链接
    let url = ''
    if (srctype) {
      url = 'https://v.ddys.pro' + src0  // 构建视频播放链接
    }

    $print('***url: ' + url)  // 打印 URL，方便调试
    return jsonify({
      urls: [url],  // 返回包含播放链接的 JSON 数据
      headers: [{
        'Referer': 'https://ddys.pro/',  // Referer header
        'Origin': 'https://ddys.pro',   // Origin header
        'User-Agent': UA,  // User-Agent header
      }]
    })
}

// 搜索影片的函数
async function search(ext) {
  ext = argsify(ext)  // 解析扩展参数
  let cards = []  // 用于存储搜索结果

  let text = encodeURIComponent(ext.text)  // 编码搜索文本
  let page = ext.page || 1  // 获取当前页面（默认是第1页）
  if (page > 1) {
    return jsonify({
      list: cards,  // 如果是分页请求并且当前页大于1，返回空卡片列表
    })
  }

  const url = appConfig.site + `/?s=${text}&post_type=post`  // 构建搜索 URL
  const { data } = await $fetch.get(url, {
    headers  // 使用上面定义的请求头发送 GET 请求
  })
  
  const $ = cheerio.load(data)  // 使用 cheerio 解析返回的 HTML 数据
  $('article.post').each((_, each) => {  // 遍历每个文章（影片）节点
    cards.push({
      vod_id: $(each).find('h2 > a').attr('href'),  // 获取影片的 URL
      vod_name: $(each).find('h2.post-title').text(),  // 获取影片的标题
      vod_pic: '',  // 搜索结果可能没有封面图片
      vod_remarks: $(each).find('div.entry-content > p').text(),  // 获取影片的备注信息
      ext: {
        url: $(each).find('h2 > a').attr('href'),  // 影片的详细页面链接
      },
    })
  })

  return jsonify({
      list: cards,  // 返回搜索结果
  })
}
