//昊
 const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const cookie = ["BT_auth=8688STmtvWE9fMfj9m_XO6MT-bu8J2bx2pGF27BYu_9nmlwMRVd-8rK-WgPPjB_I05Yrfa3R7-QlB4kFfAWo1Kgur7IJPvMuT7tcPbvpce_qk7tp7RFHF0fdcWD3evUDFeR0eX55H19DxWgUWLkoqxDG0SFwonWy9qCOvR8v55VK",
      "BT_cookietime=b461UmezqKVCkfPkOvkOvvNxaFEaevKbYCBN8Gldps5sd0LyHzbZ",
      "PHPSESSID=lg998erieepepfipip4k3u74v5",
      "vrg_go=1",
      "vrg_sc=429fd4561a01ad5e9570f08dac039d1c",].join("; ")
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
  
    "Cookie": cookie 
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


     const respstr =JSON.parse(data)
     //$utils.toastError(typeof respstr);
      //  console.log(respstr.panlist)
     // $utils.toastError(respstr.panlist);

if(respstr.hasOwnProperty('panlist')){

   respstr.panlist.url.forEach((item, index) => {
          //  console.log(`${item}:${index}`)
            tracks.push({
                name:`${respstr.panlist.name[index].replace(/-----------/, "")}+${respstr.panlist.tname[respstr.panlist.type[index]]}`,
                pan: item,
                ext: {
                    url: '',
                },
            })

        })
 

   }else if(respstr.hasOwnProperty('file')){

$utils.toastError('网盘验证掉签')
}else{

$utils.toastError('没有网盘资源');
    

}



    

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

          
    return jsonify({ urls: [ext.url] })
}



//


async function search(ext) {
    ext = argsify(ext)
    

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/s/1---${page}/${text}`

    const { data } = await $fetch.get(url, {
       headers: {
    "User-Agent": UA,
  
    "Cookie": cookie 
  },
    })

    const $ = cheerio.load(data)
  // $utils.toastError(data);
let cards = []
   $('.v5d').each((index, element) => {
  const name = $(element).find('b').text().trim() || 'N/A';
  const imgUrl = $(element).find('picture source[data-srcset]').attr('data-srcset') || 'N/A';
  
  // 提取附加信息
  const additionalInfo = $(element).find('p').text().trim() || 'N/A';

const pathMatch =  $(element).find('a').attr('href') || 'N/A'

  
        
        cards.push({
            vod_id: pathMatch,
            vod_name: name,
            vod_pic: imgUrl,
            vod_remarks: additionalInfo,

            ext: {
                url: `${appConfig.site}/res/downurl${pathMatch}`,
            },
        })
 

});


    return jsonify({
        list: cards,
    })

}
