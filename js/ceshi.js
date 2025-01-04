const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '观影网',
    site: 'https://www.gyg.la',
    tabs: [
        {
            name: '电影',
            ext: {
                id: '/mv/------',
            },
        },
        {
            name: '剧集',
            ext: {
                id: '/tv/------',
            },
        },
        {
            name: '动漫',
            ext: {
                id: '/ac/------',
            },
        }
        
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}
