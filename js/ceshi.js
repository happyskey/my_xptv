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
 
       for(let i =0; i <playlist.length; i++){
           
        let title = $(e).attr('title')
        const href = $(e).attr('href').match(/\/vod-play\/([^\/]+\/[^\.]+)/)[1]
        const ShareUrl = `https://yhdm.one/_get_plays/${href}`


        let group = {
                title: title.trim(),
                tracks: [],
            };

    
        const new_data  = await $fetch.get(ShareUrl, {
                     'User-Agent': UA,
                          });
        
  
        const json = JSON.parse(new_data)
        const playlists = json.video_plays
        playlists.forEach( child => {
        
            group.tracks.push({
              name:  child.src_site,
              pan: '',
              ext: {
                url: child.play_data
              }
            })
   

    })

if (group.tracks.length > 0) {
            groups.push(group)
          }

    }    


return jsonify({ list: groups })
      









 //   return jsonify({"list":[{"title":"第01集","tracks":[{"name":"lzzy","pan":"","ext":{"url":"https://v.lzcdn23.com/20241108/7572_ee376b18/index.m3u8"}}]},{"title":"预告","tracks":[{"name":"tkzy2","pan":"","ext":{"url":"https://v10.dious.cc/20240329/8sSjB4Uz/index.m3u8"}}]}]})
}









async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    return jsonify({ urls: [url] })
}



