//昊
//68
 const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const cookie = ["BT_auth=eaafXbMdoN3stoD0xbAwxS5ZF0FNwRxBjClRtMRrYXfMNnHyuXtIJKkRDpf_BDn-pjI7AJO5_0kqUTjYo1-C6o9km8RXuoW_n1Toqs0vTUv9fIRBehmMF1Y5UoCxRk3_Lrk3AdEttJskAyvYmgEe75LZRCtZqC7cHzOG0S0Tg5UA",
      "BT_cookietime=3bb6gBq68zhQtACydkV1QN0aJiUZkTOHRjzKUbkdNEiqK11G69Ju",
      "PHPSESSID=dvpsqd0l0qi7s0e7pamuqrvhhe"
    ].join("; ")
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
const { data } = await $fetch.get(url, {
  headers: {
    "User-Agent": UA,
  
    "Cookie": [
      "BT_auth=eaafXbMdoN3stoD0xbAwxS5ZF0FNwRxBjClRtMRrYXfMNnHyuXtIJKkRDpf_BDn-pjI7AJO5_0kqUTjYo1-C6o9km8RXuoW_n1Toqs0vTUv9fIRBehmMF1Y5UoCxRk3_Lrk3AdEttJskAyvYmgEe75LZRCtZqC7cHzOG0S0Tg5UA",
      "BT_cookietime=3bb6gBq68zhQtACydkV1QN0aJiUZkTOHRjzKUbkdNEiqK11G69Ju",
      "PHPSESSID=dvpsqd0l0qi7s0e7pamuqrvhhe"
    ].join("; ")
  },
});


     
    
    const $ = cheerio.load(data)
 
    
    const scriptContent = $('script').filter((_, script) => {
            return $(script).html().includes('_obj.header');
        }).html();

        const jsonStart = scriptContent.indexOf('{');
        const jsonEnd = scriptContent.lastIndexOf('}') + 1;
        const jsonString = scriptContent.slice(jsonStart, jsonEnd);

// 提取 _obj.inlist 部分
const inlistMatch = jsonString.match(/_obj\.inlist=({.*});/);
if (!inlistMatch) {
    $utils.toastError("未找到 _obj.inlist 数据");
} else {
    // 解析为 JSON 对象
    const inlistData = JSON.parse(inlistMatch[1]);

    // 定义目标字段
    //const targetFields = ['a', 'r', 'z', 'd', 'i', 'g', 't', 'ty'];

    // 提取并输出每个字段
    //console.log(inlistData)
    
    inlistData["i"].forEach((item,index)=>{
      //console.log(`${index}:${item}`)
      
      
      cards.push({
                  vod_id: item,
                  vod_name: inlistData["t"][index],
                  vod_pic: `https://s.tutu.pm/img/${inlistData["ty"]}/${item}.webp`,
                  vod_remarks: inlistData["g"][index], // 海報右上角的子標題
                  ext: {
                      url: `https://www.gyg.la/res/downurl/${inlistData["ty"]}/${item}`,
                  },
              })
              
              
            //  console.log(cards)
      
      
    })
    
    
    
    
    
    
}


    return jsonify({
        list: cards,
    })

    
}

//

async function getTracks(ext) {
    
    ext = argsify(ext)
   let tracks = []
    
    let url = ext.url
    
    

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
            "Cookie":cookie 
        },
    })


     const respstr = data
  $utils.toastError(typeof respstr);
 respstr = JSON.parse(respstr)
 $utils.toastError(typeof respstr);
      //  console.log(respstr.panlist)
        respstr.panlist.url.forEach((item, index) => {
          //  console.log(`${item}:${index}`)
            tracks.push({
                name: respstr.panlist.tname[respstr.panlist.type[index]],
                pan: item,
                ext: {
                    url: '',
                },
            })

        })

   



    

   return jsonify({
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
      
   
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
