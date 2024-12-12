//昊
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: 'NikeTV|昊',
    site: 'https://www.whbzj.com',
    tabs: [
        {
            name: '电影',
            ext: {
                id: 'dianying',
            },
        },
        {
            name: '电视剧',
            ext: {
                id: 'dsj',
            },
        },
        {
            name: '综艺',
            ext: {
                id: 'zongyi',
            },
        },
        {
            name: '动漫',
            ext: {
                id: 'dongman',
            },
        }
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}
//https://www.whbzj.com/vodshow/dianying--------2---.html


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + `/vodshow/${id}--------${page}---.html` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-item')
    videos.each((_, e) => {
        const href = $(e).find('.module-item-title a').attr('href');//
        const title = $(e).find('.module-item-title').attr('title');//
        const cover = $(e).find('.module-item-pic img').attr('data-src');
        const remarks = $(e).find('.module-item-text').text();
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks, // 海報右上角的子標題
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}
