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
            'Referer': 'https://yhdm.one/',
            'Origin': 'https://yhdm.one',
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


//
async function getTracks(ext) {
    ext = argsify(ext);
    let groups = [];
    let url = ext.url;

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
             'Referer': 'https://yhdm.one/',
            'Origin': 'https://yhdm.one',
        },
    });

    const $ = cheerio.load(data);
    const playlist = $('.ep-panel.mb-3 a');
   

    if (playlist.length === 0) {

        return jsonify({ list: groups });
    }

    for (const e of playlist) {
        let name = $(e).attr('title');
        const href = $(e).attr('href').match(/\/vod-play\/([\d\/]+)\.html/);
        
        if (!href) continue; // 如果 href 为空，跳过

        const getID = appConfig.site + href;
        
        let new_url ='https://yhdm.one/_get_plays/2024684901/ep1'// 'https://yhdm.one/_get_plays/' + getID;
      

        try {
            let group = {
                title: name, // 集数
                tracks: [],
            };


            /*
            const new_data = await $fetch.get(new_url, {
                headers: {
                    'User-Agent': UA,
                     'Referer': 'https://yhdm.one/',
                    'Origin': 'https://yhdm.one',
                },
            });

 

            const Data = typeof new_data === 'string' ? JSON.parse(new_data) : new_data;
 
            const playlists = Data.video_plays;
*/
            const playlists =[ { "play_data": "https://hd.ijycnd.com/play/9b6589Na/index.m3u8", "src_site": "jyzy" }, { "play_data": "https://hn.bfvvs.com/play/Le351wpb/index.m3u8", "src_site": "hnzy" }, { "play_data": "https://play.xluuss.com/play/7e55yLXe/index.m3u8", "src_site": "xlzy" }, { "play_data": "https://v.gsuus.com/play/Rb47xLJa/index.m3u8", "src_site": "gszy" }, { "play_data": "https://bfikuncdn.com/20240815/F51PgYkC/index.m3u8", "src_site": "ikzy" }, { "play_data": "https://v2.tlkqc.com/wjv2/202408/15/Qj0JuMsr0074/video/index.m3u8", "src_site": "wjzy2" }, { "play_data": "https://v.cdnlz22.com/20240815/3725_2916c479/index.m3u8", "src_site": "lzzy" }, { "play_data": "https://svipsvip.ffzy-online5.com/20240815/31398_eba62c42/index.m3u8", "src_site": "ffzy" }, { "play_data": "https://v10.dious.cc/20240815/hCrqkIxB/index.m3u8", "src_site": "tkzy2" }, { "play_data": "https://vod12.wgslsw.com/20240816/Qj0JuMsr0074/index.m3u8", "src_site": "yhzy" }, { "play_data": "https://v5.qrssv.com/202408/15/8uVCszsjeF7/video/index.m3u8", "src_site": "snzy" }, { "play_data": "https://vv.jisuzyv.com/play/yb852Erd/index.m3u8", "src_site": "jszy" }, { "play_data": "https://play.modujx15.com/20240815/g71ZekcK/index.m3u8", "src_site": "mdzy" } ]

            for (const d of playlists) {
                group.tracks.push({
                    name: d.src_site,
                    pan: '',
                    ext: {
                        url: d.play_data,
                    },
                });
            }

            if (group.tracks.length > 0) {
                groups.push(group);
            }
        } catch (error) {
            console.error("Error fetching new_url:", new_url, error);
        }
    }

    return jsonify({ list: groups });
}



//






async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    return jsonify({ urls: [url] })
}



    /*
    
async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
   // let page = ext.page || 1
    let url = `https://yhdm.one/search?q=${text}`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('#search_list a')
    videos.each((_, e) => {
        const href =$(e).attr('href')
        const title = $(e).find('img').attr('alt')
        const cover =appConfig.site + $(e).find('img').attr('data-original')

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




        const { new_data } = await $fetch.get(ShareUrl, {
             'User-Agent': UA,
          });
  
        const json = argsify(new_data)
    
        
        playlists.forEach( each => {
        

        let group = {
          title: each.src_site,
          tracks: [],
    }
    
        let path = each.play_data
        
        group.tracks.push({
          name:  name,
          pan: '',
          ext: {
            url: path
          }
        })
      
    })

         if (group.tracks.length > 0) {
      groups.push(group)
    }

        




*/
