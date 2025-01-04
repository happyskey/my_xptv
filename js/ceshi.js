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



async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + id + page
const { data } = await $fetch.get(url, {
  headers: {
    "User-Agent": UA,
  
    "Cookie": [
      "BT_auth=eaafXbMdoN3stoD0xbAwxS5ZF0FNwRxBjClRtMRrYXfMNnHyuXtIJKkRDpf_BDn-pjI7AJO5_0kqUTjYo1-C6o9km8RXuoW_n1Toqs0vTUv9fIRBehmMF1Y5UoCxRk3_Lrk3AdEttJskAyvYmgEe75LZRCtZqC7cHzOG0S0Tg5UA",
      "BT_cookietime=3bb6gBq68zhQtACydkV1QN0aJiUZkTOHRjzKUbkdNEiqK11G69Ju",
      "PHPSESSID=dvpsqd0l0qi7s0e7pamuqrvhhe"
    ].join("; ")
  },
});


     
    
    const $ = cheerio.load(data)
    
    const scriptContent = $('script').filter((_, script) => {
        return $(script).html().includes('_obj.header');
    }).html();

    const jsonStart = scriptContent.indexOf('{');
    const jsonEnd = scriptContent.lastIndexOf('}') + 1;
    const jsonString = scriptContent.slice(jsonStart, jsonEnd);
$utils.toastError(jsonString)
    /*
    const videos = $('.module-poster-item')
    videos.each((_, e) => {
        const href = $(e).attr('href')
        const title = $(e).attr('title')
        const cover = $(e).find('img').attr('data-original')
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
*/
    return jsonify({
        list: cards,
    })
}
