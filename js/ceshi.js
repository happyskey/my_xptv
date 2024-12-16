//昊
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '4K',
    site: 'https://www.4kvm.tv',
    // 定義分類
    tabs: [
        // name 為分類名，ext 可以傳入任意參數由 getCards 接收
        {
            name: '电影',
            ext: {
                id: '/movies',
            },
        },
        {
            name: '美剧',
            ext: {
                id: "/classify/meiju",
            },
        },
        {
            name: '国产剧',
            ext: {
                id: '/classify/guochan',
            },
        },
        {
            name: '韩剧',
            ext: {
                id: '/classify/hanju',
            },
        }, {
            name: '番剧',
            ext: {
                id: '/classify/fanju',
            },
        }, {
            name: '热门播放',
            ext: {
                id: "/trending",
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
    let url =''
if (page ===1){
      url = appConfig.site + `${id}`  
    $utils.toastError(url)

}else{
  url = appConfig.site + `${id}/page/${page}` 
    $utils.toastError(url)
}
    // 使用內置的 http client 發起請求獲取 html
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    // 用 cheerio 解析 html
    const $ = cheerio.load(data)

    // 用 css 選擇器選出影片列表
    const videos = $('.item.tvshows') || $('.archive-content') \\archive-content
    // 遍歷所有影片
    videos.each((_, e) => {
        const href = $(e).find('a').attr('href')
        const title = $(e).find('img').attr('alt')
        const cover = $(e).find('img').attr('src')
        const remarks = $(e).find('.update').text()
        // 將每個影片加入 cards 數組中
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks, // 海報右上角的子標題
            // ext 會傳給 getTracks
            ext: {
                url: `${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}



