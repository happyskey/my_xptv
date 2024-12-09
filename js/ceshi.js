//昊
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '美剧网',
    site: 'https://www.j00j.com/',
    tabs: [
        {
            name: '欧美剧',
            ext: {
                id: 20,
            },
        },
        {
            name: '新马泰剧',
            ext: {
                id: 21,
            },
        },
        {
            name: '韩剧',
            ext: {
                id: 22,
            },
        },{
            name: '日剧',
            ext: {
                id: 23,
            },
        },{
            name: '台剧',
            ext: {
                id: 25,
            },
        },{
            name: '在线电影',
            ext: {
                id: 24,
            },
        },{
            name: '在线综艺',
            ext: {
                id: 36,
            },
        },{
            name: '在线动漫',
            ext: {
                id: 43,
            },
        },{
            name: '在线预告',
            ext: {
                id: 48,
            },
        },{
            name: '在线短剧',
            ext: {
                id: 49,
            },
        }
        
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}


//https://www.j00j.com/index.php/vod/show/id/20/page/2.html


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + `/index.php/vod/show/id/${id}/page/${page}.html` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-poster-item')
    videos.each((_, e) => {
        const href = $(e).attr('href')
        const title = $(e).attr('title')
        const cover =appConfig.site + $(e).find('img').attr('data-original')
        const remarks = $(e).find('.module-item-note').text().trim()
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

