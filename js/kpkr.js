// 创建一个 cheerio 实例，用于解析 HTML 内容
const cheerio = createCheerio()

// 定义一个 User-Agent 字符串，用于模拟浏览器请求
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

// 定义请求头，模拟浏览器请求，避免被反爬虫机制屏蔽
const headers = {
 {
'Content-Type': 'application/json',
  'User-Agent': UA,              // User-Agent header，模拟浏览器访问
}

// 定义应用的配置，包括网站信息和分类
const appConfig = {
  ver: 1,  // 应用的版本
  title: "测试视频",  // 应用的标题
  site: "https://www.taozi008.com",  // 网站的主域名
  // 定义应用的多个分类标签及其相关链接
  tabs: [{
    name: '电影',  // 标签名称
    ext: {
      url: 229 ,// 标签对应的网址路径
    },
  }, {
    name: '电视剧',
    ext: {
      url: 230, // 电影分类的 URL
    },
  }, {
    name: '综艺',
    ext: {
      url: 231,  // 连载剧集分类的 URL
      hasMore: false  // 标记该分类不需要分页
    },
  }, {
    name: '动漫',
    ext: {
      url: 232,  // 新番动漫分类的 URL
      hasMore: false
    },
  },   
  }]
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

  url ='https://www.taozi008.com/vod/index.html?page=2&type_id=229'//appConfig.site + `/vod/index.html?page=${page}&type_id=${url}`       //`/page/${page}/`  // 拼接成具体的请求 URL

  const { data } = await $fetch.get(url, {
    headers  // 使用上面定义的请求头发送 GET 请求
  })

  const $ = cheerio.load(data)  // 使用 cheerio 解析返回的 HTML 数据
     $('.lists-content ul li').each((_, each) => {
    cards.push({
      vod_id: $(each).find('a').attr('href'), // 获取影片的链接
      vod_name: $(each).find('a > img').attr('alt'), // 获取影片名称
      vod_pic: $(each).find('a > img').attr('src'), // 获取封面图片的URL
      vod_remarks: $(each).find('.note > span').text(), // 获取影片的简介
      ext: {
        url: $(each).find('a').attr('href'),  // 影片的详细页面链接
      },
    
    
    })
   
  })


  return jsonify({
    list: cards,  // 返回抓取到的影片卡片列表
  })
}



/*
// 获取播放信息的函数
async function getPlayinfo(ext) {
    ext = argsify(ext)  // 解析扩展参数
    const { srctype, src0, } = ext  // 获取视频源类型和源链接
    let url = ''
    if (srctype) {
      url = 'https://www.taozi008.com' + src0  // 构建视频播放链接
    }

    $print('***url: ' + url)  // 打印 URL，方便调试
    return jsonify({
      urls: [url],  // 返回包含播放链接的 JSON 数据
      headers: [{
       
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

  const url = appConfig.site + `/search/index.html?keyword=${text}`                         // `/?s=${text}&post_type=post`  // 构建搜索 URL
  const { data } = await $fetch.get(url, {
    headers  // 使用上面定义的请求头发送 GET 请求
  })
  
  const $ = cheerio.load(data)  // 使用 cheerio 解析返回的 HTML 数据
  $('.lists-content ul li').each((_, each) => {  // 遍历每个文章（影片）节点
    cards.push({
      vod_id: $(each).find('a').attr('href'),  // 获取影片的 URL
      vod_name: $(each).find('a > img').text(),  // 获取影片的标题
      vod_pic: $(each).find('a > img').attr('src'),  // 搜索结果可能没有封面图片
      vod_remarks: $(each).find('.countrie .orange:nth-child(2)').text(),  // 获取影片的备注信息
      ext: {
        url: $(each).find('a').attr('href'),  // 影片的详细页面链接
      },
    })
  })

  return jsonify({
      list: cards,  // 返回搜索结果
  })
}
*/
