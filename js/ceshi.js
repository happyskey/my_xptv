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
        
        let new_url = 'https://yhdm.one/_get_plays/' + getID;
      

        try {
            let group = {
                title: name, // 集数
                tracks: [],
            };

            const new_data = await $fetch.get(new_url, {
                headers: {
                    'User-Agent': UA,
                     'Referer': 'https://yhdm.one/',
                    'Origin': 'https://yhdm.one',
                },
            });

 

            const Data = typeof new_data === 'string' ? JSON.parse(new_data) : new_data;
            Data = { "video_plays": [ { "play_data": "https://v.lzcdn23.com/20241108/7572_ee376b18/index.m3u8", "src_site": "lzzy" } ], "html_content": "\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t
\n\t\t\t\t\t\t\t\tLZ\n\t\t\t\t\t\t\t
\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t" }
            const playlists = Data.video_plays;

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
