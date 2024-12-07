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
    const playlist =$('ul.row.list-unstyled.gutters-1 li a') //$('.ep-panel.mb-3 a')
 
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
        
        new_data = [ { "play_data": "https://v.gsuus.com/play/lejpXGlb/index.m3u8", "src_site": "gszy" }, { "play_data": "https://hd.ijycnd.com/play/nelrZKrb/index.m3u8", "src_site": "jyzy" }, { "play_data": "https://hn.bfvvs.com/play/negmRB3b/index.m3u8", "src_site": "hnzy" }, { "play_data": "https://play.xluuss.com/play/mbkqYJEe/index.m3u8", "src_site": "xlzy" }, { "play_data": "https://bfikuncdn.com/20241206/5z7Ht4nK/index.m3u8", "src_site": "ikzy" }, { "play_data": "https://svipsvip.ffzy-online5.com/20241206/35807_e83a34b2/index.m3u8", "src_site": "ffzy" }, { "play_data": "https://v.cdnlz22.com/20241206/9254_08559580/index.m3u8", "src_site": "lzzy" }, { "play_data": "https://v6.tlkqc.com/wjv6/202412/06/bpV4EFgEf478/video/index.m3u8", "src_site": "wjzy2" }, { "play_data": "https://v11.dious.cc/20241206/FxNOvAi2/index.m3u8", "src_site": "tkzy2" }, { "play_data": "https://v6.qrssv.com/202412/06/Kavu6MZvir24/video/index.m3u8", "src_site": "snzy" }, { "play_data": "https://vv.jisuzyv.com/play/penw2MEa/index.m3u8", "src_site": "jszy" }, { "play_data": "https://play.modujx16.com/20241206/BWXIO9F6/index.m3u8", "src_site": "mdzy" } ]
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



