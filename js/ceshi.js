const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '樱花动漫',
    site: 'https://yhdm.one',
    tabs: [
        {
            name: '日本动漫',
            ext: {
                id: 'jp',
            },
        },
        {
            name: '国产动漫',
            ext: {
                id: 'cn',
            },
        },
        {
            name: '欧美动漫',
            ext: {
                id: 'us',
            },
        },{
            name: '其他的',
            ext: {
                id: 'other',
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
    let { page = 1, id } = ext
    const url =appConfig.site + `/list/?country=${id}&page=${page}` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('ul.list-unstyled li')
    videos.each((_, e) => {
        const href = $(e).find('a').attr('href') //视频连接后缀
        const title = $(e).find('h6').text()    //标题
        const cover =appConfig.site + $(e).find('img').attr('data-original') //图片
        const new_url = appConfig.site + href
          const  new_data  = await $fetch.get(new_url, {
        headers: {
            'User-Agent': UA,
        },
    })

        
        //const remarks = $(e).find('.note > span').text() //右上更新
        cards.push({
            vod_id: href,
            vod_name: href,
            vod_pic: cover,
            //vod_remarks: remarks, // 海報右上角的子標題
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}



/*


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + `/list/?country=${id}&page=${page}` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('ul.list-unstyled li')
    videos.each((_, e) => {
        const new_url =appConfig.sit + $(e).find('a').attr('href')//

        
        const title = $(e).find('h6').text()
        const cover =appConfig.site + $(e).find('img').attr('data-original')


   const new_data  = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

        const next = cheerio.load(new_data)

        const updateInfo = next('div.small .mb-1').text().trim(); // 获取 "更新至 第10集"
        const firstEpisode = next('ul.row.list-unstyled.gutters-1 li.ep-col a').first(); // 获取第一个剧集链接

        const href = firstEpisode.attr('href'); // 第一个 href



        
        //const remarks = $(e).find('.note > span').text()
        cards.push({
            vod_id: new_url,
            vod_name: title,
            vod_pic: cover,
           // vod_remarks: updateInfo, // 海報右上角的子標題
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}


*/



