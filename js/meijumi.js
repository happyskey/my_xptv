//�
const cheerio = createCheerio()

// �A�ȶ��xՈ��ʹ�õ� user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '������|�',
    site: 'https://www.meijumi.net',
    tabs: [
        {
            name: '����/���',
            ext: {
                id: '/usa/xuanyi/',
            },
        },
        {
            name: 'ħ��/�ƻ� ',
            ext: {
                id: '/usa/mohuan/',
            },
        },
        {
            name: '�ﰸ/������ս',
            ext: {
                id: '/usa/zuian/',
            },
        },
        {
            name: '����/��ʷ',
            ext: {
                id: '/usa/qinggan/',
            },
        },{
            name: 'ϲ��',
            ext: {
                id: '/usa/xiju/',
            },
        },{
            name: '����/ҽ��',
            ext: {
                id: '/usa/yiwu/',
            },
        },{
            name: '����/����',
            ext: {
                id: '/usa/katong/',
            },
        },{
            name: '��¼Ƭ',
            ext: {
                id: '/usa/jilu/',
            },
        },{
            name: '����/������',
            ext: {
                id: '/usa/zongyi/',
            },
        },{
            name: 'Ӣ��',
            ext: {
                id: '/en/',
            },
        },{
            name: '2024�¾�',
            ext: {
                id: '/2024�¾�/',
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
        const href = $(e).find('a').attr('href')
        const title = $(e).find('a > img').attr('alt')
        const cover = $(e).find('a > img').attr('src')
        const remarks = $(e).find('.note > span').text()
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
                title: 'Ĭ�Ϸ���',
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



