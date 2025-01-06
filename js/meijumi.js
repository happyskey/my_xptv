//昊
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '美剧迷|昊',
    site: 'https://www.meijumi.net',
    tabs: [
        {
            name: '灵异/惊悚',
            ext: {
                id: '/usa/xuanyi/',
            },
        },
        {
            name: '魔幻/科幻 ',
            ext: {
                id: '/usa/mohuan/',
            },
        },
        {
            name: '罪案/动作谍战',
            ext: {
                id: '/usa/zuian/',
            },
        },
        {
            name: '剧情/历史',
            ext: {
                id: '/usa/qinggan/',
            },
        },{
            name: '喜剧',
            ext: {
                id: '/usa/xiju/',
            },
        },{
            name: '律政/医务',
            ext: {
                id: '/usa/yiwu/',
            },
        },{
            name: '动漫/动画',
            ext: {
                id: '/usa/katong/',
            },
        },{
            name: '纪录片',
            ext: {
                id: '/usa/jilu/',
            },
        },{
            name: '综艺/真人秀',
            ext: {
                id: '/usa/zongyi/',
            },
        },{
            name: '英剧',
            ext: {
                id: '/en/',
            },
        },{
            name: '2024新剧',
            ext: {
                id: '/2024新剧/',
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
    // let page = ext.page
    // let id = ext.id
    let { page = 2, id } = ext
    const url = appConfig.site + `${id}page/${page}/`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('post_list_box')
    videos.each((_, e) => {
        const href = $(e).find('.entry-title a').attr('href');  
        const title = $(e).find('.entry-title a').text().trim()
        const cover = $(e).find('.home-thumb').attr('src');
        const remarks = $(e).find('.date').attr('title'); 
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks,
            ext: {
                url: `${href}`,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}

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
            name:name.trim(),
            pan: '',
           ext: {
                        url: ShareUrl,
                    }, 
        })
    })

    return jsonify({
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
    const idMatch = ext.url.match(/[?&]line_id=([^&]*)/)[1];
    let get_url = `https://www.taozi008.com/openapi/playline/${idMatch}`
   const {data} = await $fetch.get(get_url, {
        headers: {
            'User-Agent': UA,
        },
    })
         if (data) {
            const result = JSON.parse(data)
            let playUrl = result.info.file        
            return jsonify({ urls: [playUrl] })
         } 
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/public/auto/search1.html?keyword=${text}&page=${page}`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('.lists-content ul li a.thumbnail')
    videos.each((_, e) => {
        const href = $(e).attr('href')
        const title = $(e).find('img.thumb').attr('alt')
        const cover = $(e).find('img.thumb').attr('src')

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



