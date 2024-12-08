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
//

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
    for (const e of playlist) {
       
        let name = $(e).attr('title')
        const regex = /\/vod-play\/(.*?)\.html/;

        const ShareUrl = 'https://yhdm.one/_get_plays/' +  $(e).attr('href').match(regex)[1];


        
         let group = {
              title:name ,
              tracks: [],
        }


//后加
        
         const new_data = await $fetch.get(ShareUrl, {
                headers: {
                    'User-Agent': UA,
                      'Referer': 'https://yhdm.one/',
                        'Origin': 'https://yhdm.one',
                },
            });

        const playlists = argsify(new_data.data).video_plays

/*
        

     let  playlists = [
            { "play_data": "https://hd.ijycnd.com/play/9b6589Na/index.m3u8", "src_site": "jyzy" },
            { "play_data": "https://hn.bfvvs.com/play/Le351wpb/index.m3u8", "src_site": "hnzy" },
            { "play_data": "https://play.xluuss.com/play/7e55yLXe/index.m3u8", "src_site": "xlzy" }
        ];


*/
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
      groups.push(group)
    }





        
    }





    

return jsonify({ list: groups })
      
   
}







async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    return jsonify({ urls: [url] })
}



/*
//
async function getTracks(ext) {
    ext = argsify(ext);
    let groups = [];
    let url = ext.url;

    // 获取页面数据
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
            'Referer': 'https://yhdm.one/',
            'Origin': 'https://yhdm.one',
        },
    });

    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(data);
    const playlist = $('.ep-panel.mb-3 a');

    console.log("Playlist length:", playlist.length);  // 打印 playlist 长度，确认是否匹配到元素

    if (playlist.length === 0) {
        return jsonify({ list: groups });
    }

    // 遍历 playlist 中的每个元素
    for (const e of playlist) {
        let name = $(e).attr('title');
        const href = $(e).attr('href')//.match(/\/vod-play\/([\d\/]+)\.html/);

        console.log("Href matched:", href);  // 打印 href 的匹配结果

        if (!href) continue; // 如果 href 为空，跳过

        const getID = appConfig.site + href[1];  // 获取ID
        let new_url = 'https://yhdm.one/_get_plays/' + getID;

        // 使用静态数据测试
        const playlists = [
            { "play_data": "https://hd.ijycnd.com/play/9b6589Na/index.m3u8", "src_site": "jyzy" },
            { "play_data": "https://hn.bfvvs.com/play/Le351wpb/index.m3u8", "src_site": "hnzy" },
            { "play_data": "https://play.xluuss.com/play/7e55yLXe/index.m3u8", "src_site": "xlzy" }
        ];

        // 为每个播放源添加到 tracks 中
        let group = {
            title: name, // 集数
            tracks: [],
        };

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
    }

    // 返回最终的数据
    return jsonify({ list: groups });
}



*/









