//昊
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '新视觉影院',
    site: 'https://www.sypfjy.com',
    tabs: [
        {
            name: '电影',
            ext: {
                id: 'dianying',
            },
        },
        {
            name: '电视剧',
            ext: {
                id: 'dsj',
            },
        },
        {
            name: '综艺',
            ext: {
                id: 'zongyi',
            },
        },
        {
            name: '动漫',
            ext: {
                id: 'dongman',
            },
        },{
            name: '热门短片',
            ext: {
                id: 'remenduanju',
            },
        },{
            name: '体育赛事',
            ext: {
                id: 'tiyusaishi',
            },
        }
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}
//https://www.whbzj.com/vodshow/dianying--------2---.html


async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
    const url =appConfig.site + `/vodshow/${id}--------${page}---.html` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-item')
    videos.each((_, e) => {

const item = $(e);

    // 提取 title 和 href
    const link = item.find('.module-item-pic a');
        
    const title = link.attr('title') || 'N/A';
    const href = link.attr('href') || 'N/A';

    // 提取图片的 data-src
    const img = item.find('.module-item-pic img');
    const  cover= img.attr('data-src') || 'N/A';
    

    // 提取更新文本
    const remarks = item.find('.module-item-text').text().trim() || 'N/A';

        
    


        
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
        
    
        const tabName =  $(element).attr('data-dropdown-value');
        
    
      $utils.toastError(tabName)
  
     let group = {
              title:tabName  ,
              tracks: [],
        }


    

       const playlist = $('.scroll-content a')
    for (let j = 0; j < playlist.length; j++) {
       const element = playlist[j];
        let name = $(element).find('span').text();
      

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
