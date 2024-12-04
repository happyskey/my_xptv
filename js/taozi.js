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
    title: '桃子',
    site: 'https://www.taozi008.com',
    // 定義分類
    tabs: [
        // name 為分類名，ext 可以傳入任意參數由 getCards 接收
        {
            name: '电影',
            ext: {
                id: 229,
            },
        },
        {
            name: '电视剧',
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
    const url = appConfig.site + `/vod/index.html?page=${page}&type_id=${id}`     //`/index.php/vod/show/id/${id}/page/${page}.html`
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
        const title = $(e).find('a > img').attr('alt')
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




//获取单个播放列表
async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let url = ext.url

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const playlist = $('#eps-ul .play-btn')
    playlist.each((_, e) => {
        const name = $(e).find('a').text()
        const ShareUrl =appConfig.site + $(e).find('a').attr('href')
        tracks.push({
            name: name.trim(),
            pan: '',
           ext: {
                        url: ShareUrl,
                    }, 
        })
    })

    return jsonify({
        // list 返回一個數組，用於區分不同線路(參考 AGE 動漫及 girigiri 動漫)，但功能未實現目前只會讀取第一項
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
}

    


async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = `https://v2.fentvoss.com/sdv2/202412/04/jRys6aHswD22/video/index.m3u8`//ext.url
    return jsonify({ urls: [url] })
}





/*

async function getTracks(ext) {
    let tracks = [{
                    name: name,
                    ext: {
                        url: 'https://v2.fentvoss.com/sdv2/202412/03/74Y9FgJ2EN24/video/index.m3u8'//'https://ppvod01.blbtgg.com/splitOut/20241130/560085/V2024113012065288633560085/index.m3u8?auth_key=1733289584-e3d35681b5bc40cfad1a512d5a192658-0-b26ab5b2c8ff61bfe5f0a41f6505eb56',
                    },
                }]

  
   return jsonify({
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })

}

/*
//播放组件没有无法播放
async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    return jsonify({ urls: [url] })
}













/*
let groups = [ {
            title: '在线',
            tracks: [{
                name: '1', // 播放源的名称
                pan: '', // 网盘链接为空
                ext: 'https://v2.fentvoss.com/sdv2/202412/03/74Y9FgJ2EN24/video/index.m3u8' // 播放源的详细信息
            },{
                name: '2', // 播放源的名称
                pan: '', // 网盘链接为空
                ext: 'https://ppvod01.blbtgg.com/splitOut/20241130/560085/V2024113012065288633560085/index.m3u8?auth_key=1733289584-e3d35681b5bc40cfad1a512d5a192658-0-b26ab5b2c8ff61bfe5f0a41f6505eb56' // 播放源的详细信息
            }
                    
                    ]
        } ] 

return jsonify({ list: groups })
 
}





/*


// 获取视频播放资源（例如在线播放链接或网盘链接）
async function getTracks(ext) {
    ext = argsify(ext) // 解析扩展参数
    let groups = [] // 存储资源分组的数组
    let url = ext.url // 获取影片的URL

    // 发送请求并获取数据
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    

    // 使用Cheerio解析返回的数据
    const $ = cheerio.load(data)

    // 提取季数信息
    const seasonNumbers = []
    
    $('.page-links .post-page-numbers').each((_, each) => {
        const seasonNumber = $(each).text()
        if (!isNaN(seasonNumber)) {
            seasonNumbers.push(seasonNumber) // 收集季数信息
        }
    })

    // 如果没有季数信息，则处理在线资源
    if (seasonNumbers.length === 0) {
        let onlineGroup = {
            title: '在线',
            tracks: []
        }

        // 提取并解析视频播放数据
        const trackText = $('script.wp-playlist-script').text()
        const tracks = JSON.parse(trackText).tracks

        // 将每个播放源添加到资源组中
        tracks.forEach(each => {
            onlineGroup.tracks.push({
                name: each.caption, // 播放源的名称
                pan: '', // 网盘链接为空
                ext: each // 播放源的详细信息
            })
        })

        // 将在线资源添加到资源分组
        groups.push(onlineGroup)
    } else {
        // 如果有季数信息，处理每个季的播放资源
        for (const season of seasonNumbers) {
            let seasonGroup = {
                title: `第${season}季`,
                tracks: []
            }

            const seasonUrl = `${url}${season}/`
            const seasonData = await $fetch.get(seasonUrl, {
                headers
            })
            const season$ = cheerio.load(seasonData.data)

            // 获取并解析季的播放资源
            const trackText = season$('script.wp-playlist-script').text()
            const tracks = JSON.parse(trackText).tracks

            tracks.forEach(each => {
                seasonGroup.tracks.push({
                    name: each.caption, // 播放源名称
                    pan: '', // 网盘链接为空
                    ext: each // 资源的详细信息
                })
            })

            groups.push(seasonGroup) // 添加季资源分组
        }
    }

    // 添加网盘资源组
    let group2 = {
        title: '',
        tracks: []
    }

    // 搜索并提取网盘链接
    $('a').each((_, each) => {
        const v = $(each).attr('href')
        if (v.startsWith('https://drive.uc.cn/s')) {
            group2.tracks.push({
                name: 'uc网盘',
                pan: v, // 夸克网盘链接
            })
        } else if (v.startsWith('https://pan.quark.cn/s/')) {
            group2.tracks.push({
                name: '夸克网盘',
                pan: v, // 夸克网盘链接
            })
        }
    })

    if (group2.tracks.length > 0) {
        groups.push(group2) // 如果有网盘链接，则添加网盘资源组
    }

    // 返回资源分组
    return jsonify({ list: groups })
}





/*
// 取得播放列表
async function getTracks(ext) {
    ext = argsify(ext)
    let groups = []
    let url = ext.url

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const playlist = $('#eps-ul .play-btn')
    playlist.each((_, e) => {
        let group = {
            tracks: [],
        }
        const name = $(e).find('a').text()
        // 網盤的分享連結
        const ShareUrl = $(e).find('a').attr('href')
            group.tracks.push({
                name: `${name}`,
                pan: '',
                ext: {
                    url: ShareUrl,
                },
                
            })
         groups.push(group)
        })

return jsonify({
         list: groups,
    
    })
}
       
 

/*

// 取得播放列表
async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let url = ext.url

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const playlist = $('.module-player-list .module-row-one')
    playlist.each((_, e) => {
        const name = $(e).find('.module-row-title h4').text().replace('- 第1集', '')
        // 網盤的分享連結
        const panShareUrl = $(e).find('.module-row-title p').text()
        tracks.push({
            name: name.trim(),
            pan: panShareUrl,
        })
    })

    return jsonify({
        // list 返回一個數組，用於區分不同線路(參考 AGE 動漫及 girigiri 動漫)，但功能未實現目前只會讀取第一項
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
}




// 網盤源不需要寫播放
async function getPlayinfo(ext) {
    return jsonify({ urls: [] })
}

// search 的寫法跟 getCards 一樣，唯一不同就是由分類 id 改為關鍵字
async function search(ext) {
    ext = argsify(ext)
    let cards = []

    // 必須把中文編碼否則 iOS 16 會報錯
    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/index.php/vod/search/page/${page}/wd/${text}.html`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('#main .module-search-item')
    videos.each((_, e) => {
        const href = $(e).find('.video-info-header h3 a').attr('href')
        const title = $(e).find('.module-item-pic img').attr('alt')
        const cover = $(e).find('.module-item-pic img').attr('data-src')
        const remarks = $(e).find('.video-serial').text()
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

*/
