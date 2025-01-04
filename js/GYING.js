//昊
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const appConfig = {
    ver: 1,
    title: '观影网',
    site: 'https://www.gyg.la',
    tabs: [
        {
            name: '电影',
            ext: {
                id: '/mv/------',
            },
        },
        {
            name: '剧集',
            ext: {
                id: '/tv/------',
            },
        },
        {
            name: '动漫',
            ext: {
                id: '/ac/------',
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
    const url =appConfig.site + id + page
     $utils.toastError(url)
    const { data } = await $fetch.get(url, {
        headers: {
          "Host": "ww.gyg.la",
          "Sec-Fetch-Site": "ame-origin",
          "Accept-Encoding": "zip, deflate, br",
          "Connection": "eep-alive",
          "Sec-Fetch-Mode": "ors",
          "Accept": "/*",
          "User-Agent": "ozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
         // "Referer": "ttps://www.gyg.la/mv",
          "Sec-Fetch-Dest": "mpty",
          "Accept-Language": "h-CN,zh-Hans;q=0.9"
        },
      
    },{
          cookies: {
          "BT_auth": "eaafXbMdoN3stoD0xbAwxS5ZF0FNwRxBjClRtMRrYXfMNnHyuXtIJKkRDpf_BDn-pjI7AJO5_0kqUTjYo1-C6o9km8RXuoW_n1Toqs0vTUv9fIRBehmMF1Y5UoCxRk3_Lrk3AdEttJskAyvYmgEe75LZRCtZqC7cHzOG0S0Tg5UA",
          "BT_cookietime": "3bb6gBq68zhQtACydkV1QN0aJiUZkTOHRjzKUbkdNEiqK11G69Ju",
          "PHPSESSID": "dvpsqd0l0qi7s0e7pamuqrvhhe",
        }
    })

     $utils.toastError(url)
    /*
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
*/
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
        
    
        const tabName = $(element).find('span').text().trim() || $(element).attr('data-dropdown-value');
        
    
      
  
     let group = {
              title:tabName  ,
              tracks: [],
        }


    

       const playlist = $('.module-play-list-link')
    for (let j = 0; j < playlist.length; j++) {
       const element = playlist[j];
        let name = $(element).attr('title')
      

       const href = $(element).attr('href')

       // const ShareUrl = href //
   ///index.php/vod/play/id/106815/sid/1/nid/7.html
        
        const sid_key = /sid\/(\d+)\/nid\/(\d+)/;
        const id_key = href.match(sid_key)[1];
    
      if(key.toString()=== id_key )
          {
   
        
            group.tracks.push({
                name: name,
                pan: '',
                ext: {
                    url: appConfig.site + href,
                },
            });
       
      }//if
        
        
       }//内层for

    
if (group.tracks.length > 0) {
      groups.push(group)
    }
key = key + 1; 

   }//外循环

    

return jsonify({ list: groups })
      
   
}



async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    
    


  const other_data  = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

          
 
const new_html =cheerio.load(other_data.data) 
const scriptContent = new_html('script:contains("player_aaaa")').text()
              
//const Regex = /"url":"(.*?)"/;//
//const url_id = scriptContent.match(Regex)[1].replace(/\\/g, "")


   eval(scriptContent)
   const url_id= player_aaaa.url
    return jsonify({ urls: [url_id] })
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
