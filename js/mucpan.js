const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '小米UC资源站',
    site: 'http://www.mucpan.cc',
    tabs: [
        {
            name: '全部小米电影',
            ext: {
                id: 20,
            },
        },
        {
            name: '小米电影片库',
            ext: {
                id: 21,
            },
        },
        {
            name: '小米动漫片库',
            ext: {
                id: 22,
            },
        },
        {
            name: '小米综艺片库',
            ext: {
                id: 23,
            },
        }, 
      {
            name: '小米少儿片库',
            ext: {
                id: 24,
            },
        },
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}
async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
   //http://www.mucpan.cc/index.php/vod/show/id/21/page/2.html
    // let page = ext.page
    // let id = ext.id
    let { page = 1, id } = ext
    const url = appConfig.site + `/index.php/vod/show/id/${id}/page/${page}.html`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-item')
    videos.each((_, e) => {
        const href = $(e).find('.module-item-cover a').attr('href')
        const title = $(e).find('.module-item-cover a').attr('title')
        const cover = $(e).find('img').attr('src')
        const remarks = $(e).find('.module-item-text').text()
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks,
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}

