//昊
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '美剧网',
    site: 'https://www.j00j.com',
    tabs: [
        {
            name: '欧美剧',
            ext: {
                id: 20,
            },
        },
        {
            name: '新马泰剧',
            ext: {
                id: 21,
            },
        },
        {
            name: '韩剧',
            ext: {
                id: 22,
            },
        },{
            name: '日剧',
            ext: {
                id: 23,
            },
        },{
            name: '台剧',
            ext: {
                id: 25,
            },
        },{
            name: '在线电影',
            ext: {
                id: 24,
            },
        },{
            name: '在线综艺',
            ext: {
                id: 36,
            },
        },{
            name: '在线动漫',
            ext: {
                id: 43,
            },
        },{
            name: '在线预告',
            ext: {
                id: 48,
            },
        },{
            name: '在线短剧',
            ext: {
                id: 49,
            },
        }
        
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}


//https://www.j00j.com/index.php/vod/show/id/20/page/2.html


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + `/index.php/vod/show/id/${id}/page/${page}.html` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-poster-item')
    videos.each((_, e) => {
        const href = $(e).attr('href')
        const title = $(e).attr('title')
        const cover = $(e).find('img').attr('data-original')
        const remarks = $(e).find('.module-item-note').text().trim()
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks, // 海報右上角的子標題
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
    
    ext = argsify(ext)
   let groups = []
    
    let url = ext.url
    
    

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })


    

    const $ = cheerio.load(data)
    
    //获取外层列表
    const tabItems = $('.module-tab-item')
    let key = 1
   for (let i = 0; i < tabItems.length; i++) {
        const element = tabItems[i];
        
        // 优先获取 tabName，若为空则获取 data-dropdown-value
        const tabName = $(element).find('span').text().trim() || $(element).attr('data-dropdown-value');
        
        // 将 tabName 和对应的索引 i+1 添加到字典中
        // key = key + 1; 
  
     let group = {
              title:tabName  ,//线路名上拉菜单
              tracks: [],
        }


    

       const playlist = $('.module-play-list-link')
    for (let i = 0; i < playlist.length; i++) {
       const element = playlist[i];
        let name = $(element).attr('title')
      
      //  const regex = $(element).attr('href')//[1].replace(/sid\/\d+/g, `sid/${key}`).replace(/nid\/\d+/g, `nid/${key}`);//"/index.php/vod/play/id/106815/sid/1/nid/7.html";替换里面的1
       const href = $(element).attr('href')

        const ShareUrl = href
   ///index.php/vod/play/id/106815/sid/1/nid/7.html
        
        const sid_key = /sid\/(\d+)\/nid\/(\d+)/;
        const id_key = href.match(sid_key)[1];
    
      if(key.toString()!== id_key ) continue;
          //{

      
        
            group.tracks.push({
                name: href,
                pan: '',
                ext: {
                    url:appConfig.site + href,
                },
            });


          
           
      // }
        //
        
        
       }//内层for




 



    
if (group.tracks.length > 0) {
      groups.push(group)
    }
//key = key + 1; 

   }//外循环

    

return jsonify({ list: groups })
      
   
}





//播放

async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url

   const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
const $ = cheerio.load(data)
let playerData = '';
$('script').each((i, element) => {
    const scriptContent = $(element).html();
    if (scriptContent.includes('var player_aaaa=')) {
        const match = scriptContent.match(/var player_aaaa=({.*});/);
        if (match && match[1]) {
            playerData = JSON.parse(match[1]); // 解析 JSON 数据
        }
    }
})
    
    return jsonify({ urls: [playerData.data.url] })
}





//

//https://www.j00j.com/index.php/vod/search/page/2/wd/柯南.html
async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/index.php/vod/search/page/${page}/wd/${text}.html`//https://yhdm.one/search?q=%E5%90%8D

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('.module-card-item')
    videos.each((_, e) => {
        const href = $(e).find('a.module-card-item-poster').attr('href') || '';
        
        const title =  $(e).find('.module-card-item-title strong').text().trim() || '';
        
        const cover =$(e).find('.module-item-pic img').attr('data-original') || '';  
        const remarks = $(e).find('.module-item-note').text().trim() || '';

        
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
