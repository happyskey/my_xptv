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
        const href = $(e).find('a').attr('href')
        const title = $(e).find('h6').text()
        const cover =appConfig.site + $(e).find('img').attr('data-original')
        //const remarks = $(e).find('.note > span').text()
        cards.push({
            vod_id: href,
            vod_name: title,
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

    const playlist = $('a')
    playlist.each((_, e) => {
        const name = $(e).attr('href')
        const ShareUrl =appConfig.site + $(e).attr('title')

        


        
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

<div class="lists-content">
            <ul>
    <li>
        <a href="/vod/player.html?cate_id=264&amp;id=79305&amp;type_id=232" class="thumbnail">
                <img src="https://shandianpic.com/upload/vod/20230911-1/0448dd1ac753bb8f52e514136abb2cca.jpg" class="thumb" alt="名侦探柯南：绯色的不在场证明">提取hrf src alt

 $('.lists-content ul li a.thumbnail').each((index, element) => {
      const href = $(element).attr('href'); // 提取 href 属性
      const src = $(element).find('img.thumb').attr('src'); // 提取 img 标签中的 src 属性
      const alt = $(element).find('img.thumb').attr('alt'); // 提取 img 标签中的 alt 属性

*/
