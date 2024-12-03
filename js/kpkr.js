const cheerio = createCheerio()
// const CryptoJS = createCryptoJS()
// const JSEncrypt = loadJSEncrypt()
/*
以上是可以調用的第三方庫，使用方法自行查閱文檔
內置方法有:
$print: 等同於 console.log
$fetch: http client，可發送 get 及 post 請求
    get: $fetch.get(url,options)
    post: $fetch.post(url,postData,options)
argsify, jsonify: 等同於 JSON 的 parse 及 stringify
$html: 內置的 html 解析方法，建議用 cheerio 替代
$cache: 可將數據存入緩存
    set: $cache.set(key, value)
    get: $cache.get(key)
*/

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

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

// 進入源時調用，ver,title,site,tabs 為必須項
async function getConfig() {
    return jsonify(appConfig)
}

// 取得分類的影片列表，ext 為 tabs 定義的 ext 加上頁碼(page)
async function getCards(ext) {
    // 將 JSON 字符串轉為 JS 對象
    ext = argsify(ext)
    // 定義一個空的卡片數組
    let cards = []
    // 從 ext 中解構賦值取出頁數及分類 id，等同於:
    // let page = ext.page
    // let id = ext.id
    let { page = 1, id } = ext

    // 定義請求的 URL
    const url = appConfig.site +`/vod/index.html?page=2&type_id=230` //`/vod/index.html?${page}&type_id=${id}`//`/index.php/vod/show/id/${id}/page/${page}.html`
    // 使用內置的 http client 發起請求獲取 html
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    // 用 cheerio 解析 html
    const $ = cheerio.load(data)

    // 用 css 選擇器選出影片列表
    const videos = $('.lists-content ul li')
    // 遍歷所有影片
    videos.each((_, e) => {
        const href = $(e).find('a').attr('href')
        const title = $(e).find('h2.post-box-title').attr('alt')
        const cover = $(e).find('a > img').attr('src')
        const remarks = $(e).find('.note > span').text()
        // 將每個影片加入 cards 數組中
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks, // 海報右上角的子標題
            // ext 會傳給 getTracks
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}

// 取得播放列表
