//昊
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '4K',
    site: 'https://www.4kvm.tv',
    // 定義分類
    tabs: [
        // name 為分類名，ext 可以傳入任意參數由 getCards 接收
        {
            name: '电影',
            ext: {
                id: 'movies',
            },
        },
        {
            name: '美剧',
            ext: {
                id: "/classify/meiju",
            },
        },
        {
            name: '国产剧',
            ext: {
                id: '/classify/guochan',
            },
        },
        {
            name: '韩剧',
            ext: {
                id: '/classify/hanju',
            },
        }, {
            name: '番剧',
            ext: {
                id: '/classify/fanju',
            },
        }, {
            name: '热门播放',
            ext: {
                id: "/trending",
            },
        },
    ],
}

// 進入源時調用，ver,title,site,tabs 為必須項
async function getConfig() {
    return jsonify(appConfig)
}






// 取得分類的影片列表，ext 為 tabs 定義的 ext 加上頁碼(page)
async function getCards(ext) {
    // 將 JSON 字符串轉為 JS 對象
    ext = argsify(ext)
    // 定義一個空的卡片數組
    let cards = []
    // 從 ext 中解構賦值取出頁數及分類 id，等同於:
    // let page = ext.page
    // let id = ext.id
    let { page = 1, id } = ext

    // 定義請求的 URL
    const url = appConfig.site + `${id}/meiju/page/${page}`    //`/index.php/vod/show/id/${id}/page/${page}.html`
    // 使用內置的 http client 發起請求獲取 html
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    // 用 cheerio 解析 html
    const $ = cheerio.load(data)

    // 用 css 選擇器選出影片列表
    const videos = $('.item.tvshows')
    // 遍歷所有影片
    videos.each((_, e) => {
        const href = $(e).find('a').attr('href')
        const title = $(e).find('img').attr('alt')
        const cover = $(e).find('img').attr('src')
        const remarks = $(e).find('.update').text()
        // 將每個影片加入 cards 數組中
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks, // 海報右上角的子標題
            // ext 會傳給 getTracks
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
        const tabName =  $(element).attr('data-dropdown-value');
        // $utils.toastError(tabName )  
         let group = {
                  title:tabName  ,
                  tracks: [],
            }


    

         const playlist = $('.scroll-content a')
    for (let j = 0; j < playlist.length; j++) {
        const element = playlist[j];
        let name = $(element).find('span').text();
        const href = $(element).attr('href')
   //vodplay/146988-2-4.html
        const id_key = href.match(/-(\d+)-/)[1];
    
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


//https://www.sypfjy.com/vodsearch%E9%BB%91%E8%89%B2/page/2.html
async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/vodsearch${text}/page/${page}.html`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('.module-search-item')
    videos.each((_, e) => {
        const href = $(e).find('a.video-serial').attr('href') 
        
        const title =  $(e).find('img').attr('alt') 
        
        const cover =$(e).find('img').attr('data-src') 
        const remarks = $(e).find('a.video-serial').text().trim() 

        
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
