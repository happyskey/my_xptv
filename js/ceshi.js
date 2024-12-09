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
