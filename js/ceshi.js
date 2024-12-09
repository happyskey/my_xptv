//昊
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '黑猫TV|昊',
    site: 'https://heimaotv.vip',
    tabs: [
        {
            name: '电影',
            ext: {
                id: '/vodshow-31.html',
            },
        },
        {
            name: '电视剧',
            ext: {
                id: '/vodshow-49.html',
            },
        },
        {
            name: '综艺',
            ext: {
                id: '/vodshow-66.html',
            },
        },{
            name: '抖音短视频',
            ext: {
                id: '/vodshow-117.html',
            },
        }
        
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    // let page = ext.page
    // let id = ext.id
    let { page = 1, id } = ext
    const url = appConfig.site + id
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('#dataList .public-list-box')
    videos.each((_, e) => {
        const href =  $(e).find('.public-list-exp').attr('href')
        const img = $(e).find('img');  // 获取图片元素
        const cover = img.attr('data-src') || img.attr('src');  // 获取封面图片链接，优先使用 data-src
        
        const title = img.attr('alt');  // 获取影片标题
        
    
        //const remarks = 
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: '',
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}
