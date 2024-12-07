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
    let groups = []
    
    let url = ext.url
    
    

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })


    

    const $ = cheerio.load(data)
    const playlist = $('.ep-panel.mb-3 a')
    playlist.each((_, e) => {
       
        let name = $(e).attr('title')
        const ShareUrl =appConfig.site + $(e).attr('href')  




        
        let group = {
          title: name,
          tracks: [],
    }
        

        const new_data  = await $fetch.get(ShareUrl, {
                     'User-Agent': UA,
                          });
        
  
        const json = argsify(new_data)
        const playlists = json.video_plays



        //const playlists = [ { "play_data": "https://bfikuncdn.com/20241205/uWfZfPZ1/index.m3u8", "src_site": "ikzy" }, { "play_data": "https://hd.ijycnd.com/play/lejpXKWb/index.m3u8", "src_site": "jyzy" }, { "play_data": "https://svipsvip.ffzy-online5.com/20241205/35797_0126af62/index.m3u8", "src_site": "ffzy" }, { "play_data": "https://v.cdnlz22.com/20241205/9243_64206af9/index.m3u8", "src_site": "lzzy" }, { "play_data": "https://v5.tlkqc.com/wjv5/202412/05/iJic8fALXb77/video/index.m3u8", "src_site": "wjzy2" }, { "play_data": "https://cdn.wlcdn99.com:777/3ed0e23f/index.m3u8", "src_site": "wlzy2" }, { "play_data": "https://v11.dious.cc/20241205/ibTpuTaV/index.m3u8", "src_site": "tkzy2" }, { "play_data": "https://v4.qrssv.com/202412/05/CsZZ37hQ1d22/video/index.m3u8", "src_site": "snzy" }, { "play_data": "https://play.modujx16.com/20241205/z8WCjLPY/index.m3u8", "src_site": "mdzy" }, { "play_data": "https://vv.jisuzyv.com/play/nelrZglb/index.m3u8", "src_site": "jszy" } ]
        playlists.forEach( each => {
        

        let line = each.src_site
        let path = each.play_data
        
        group.tracks.push({
          name:  line,
          pan: '',
          ext: {
            url: path
          }
        })


   

    })


      groups.push(group)
    


        })    


return jsonify({ list: groups })
      
   
}









async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    return jsonify({ urls: [url] })
}



