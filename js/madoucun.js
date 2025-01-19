//昊
const cheerio = createCheerio()

//https://madoucun.com/vodsearch/巨----------2---.html
const timestamp = (new Date()).valueOf();

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const cookie = {
  "5edf439fd173772c341977da2df73cd2": "b51e1e38b857fce2f9d871a9031f8e11",
  "bd677e2b4d25e8ca5d39e5838e3fc5f7": "2ab7e9172e2195e436471c95bfbc509c",
  "__51uvsct__JjgJ2Z3Pwy8NoiNL": "2",
  "__51vcke__JjgJ2Z3Pwy8NoiNL": "e0a32bae-31e0-5ba9-92bd-3be7f5e3ce03",
  "__51vuft__JjgJ2Z3Pwy8NoiNL": `${timestamp}`,
  "__vtins__JjgJ2Z3Pwy8NoiNL": "%7B%22sid%22%3A%20%2297461bd9-2bde-50c4-a542-750a6ad11e18%22%2C%20%22vd%22%3A%201%2C%20%22stt%22%3A%200%2C%20%22dr%22%3A%200%2C%20%22expires%22%3A%201737176920622%2C%20%22ct%22%3A%201737175120622%7D",
  "1939dc21d66b2ef6a0c761f0d20135b1": "382b779d2409c5fb8b8dd35190583586",
  "4ecb4333b1616d2d960245ca976b17a3": "0e90fb88bda656fbfbc509a8d9e49f3d",
  "d2c676cd7770777c2bc19a9dd5ab43d0": "adf8a9851a310ea4585b4b02f22be9f7",
  "22ebba9f927474280cb7b92edd69c172": "1828202b06a24e62e9290a1fd507013a",
  "ax": "BkDBAHnqeJ",
  "170a2fdb3c09f62387d3cfceb80761a4": "7ab5e89bb6e0ddc5043acf14eee8a190",
  "ead2799b3a0ca3299cda7f18dd48de3e": "b078f9430f08ba43909dec33395929ea",
}


const appConfig = {
	ver: 1,
	title: '麻豆村',
	site: 'https://www.madoucun.com',
	tabs: [
 	{
    name: "麻豆传媒",
    ext: {
        id: "/vodtype/6",

    },

},
 	{
    name: "皇家华人",
    ext: {
        id: "/vodtype/7",

    },

},{
    name: "糖心Vlog",
    ext: {
        id: "/vodtype/25",

    },

},{
    name: "星空传媒",
    ext: {
        id: "/vodtype/10",

    },

},{
    name: "兔子先生",
    ext: {
        id: "/vodtype/11",

    },

},{
    name: "精东影业",
    ext: {
        id: "/vodtype/12",

    },

},{
    name: "天美传媒",
    ext: {
        id: "/vodtype/20",

    },

},{
    name: "蜜桃传媒",
    ext: {
        id: "/vodtype/9",

    },

},{
    name: "玩偶姐姐",
    ext: {
        id: "/vodtype/8",

    },

},{
    name: "杏吧原创",
    ext: {
        id: "/vodtype/21",

    },

},{
    name: "色控PsychoPorn",
    ext: {
        id: "/vodtype/22",

    },

},{
    name: "萝莉社",
    ext: {
        id: "/vodtype/72",

    },

},{
    name: "91茄子",
    ext: {
        id: "/vodtype/23",

    },

},{
    name: "91制片厂",
    ext: {
        id: "/vodtype/24",

    },

},{
    name: "起点传媒",
    ext: {
        id: "/vodtype/26",

    },

},{
    name: "大象传媒",
    ext: {
        id: "/vodtype/27",

    },

},{
    name: "SA传媒",
    ext: {
        id: "/vodtype/28",

    },

},{
    name: "性视界",
    ext: {
        id: "/vodtype/29",

    },

},{
    name: "果冻传媒",
    ext: {
        id: "/vodtype/30",

    },

},{
    name: "葫芦影业",
    ext: {
        id: "/vodtype/31",

    },

},{
    name: "北京天使",
    ext: {
        id: "/vodtype/33",

    },

},{
    name: "SWAG",
    ext: {
        id: "/vodtype/133",

    },

},{
    name: "EDmosaic",
    ext: {
        id: "/vodtype/125",

    },

},{
    name: "焦点传媒",
    ext: {
        id: "/vodtype/129",

    },

},{
    name: "爱豆传媒",
    ext: {
        id: "/vodtype/126",

    },

},{
    name: "麦尼传媒",
    ext: {
        id: "/vodtype/127",

    },

},{
    name: "香蕉秀",
    ext: {
        id: "/vodtype/128",

    },

},{
    name: "冠希GX",
    ext: {
        id: "/vodtype/130",

    },

},{
    name: "爱神传媒",
    ext: {
        id: "/vodtype/131",

    },

},{
    name: "三只狼",
    ext: {
        id: "/vodtype/132",

    },

},{
    name: "有码",
    ext: {
        id: "/vodtype/13",

    },

},{
    name: "巨乳",
    ext: {
        id: "/vodtype/14",

    },

},{
    name: "中文字幕",
    ext: {
        id: "/vodtype/67",

    },

},{
    name: "乱伦",
    ext: {
        id: "/vodtype/15",

    },

},{
    name: "出轨",
    ext: {
        id: "/vodtype/16",

    },

},{
    name: "人妻",
    ext: {
        id: "/vodtype/34",

    },

},{
    name: "强奸",
    ext: {
        id: "/vodtype/35",

    },

},{
    name: "制服",
    ext: {
        id: "/vodtype/36",

    },

},{
    name: "调教",
    ext: {
        id: "/vodtype/37",

    },

},{
    name: "丝袜",
    ext: {
        id: "/vodtype/92",

    },

},{
    name: "无码",
    ext: {
        id: "/vodtype/66",

    },

},{
    name: "AI换脸",
    ext: {
        id: "/vodtype/63",

    },

},{
    name: "海角社区",
    ext: {
        id: "/vodtype/138",

    },

},{
    name: "OnlyFans",
    ext: {
        id: "/vodtype/139",

    },

},{
    name: "国产乱伦",
    ext: {
        id: "/vodtype/96",

    },

},{
    name: "网曝门",
    ext: {
        id: "/vodtype/53",

    },

},{
    name: "精品视频",
    ext: {
        id: "/vodtype/43",

    },

},{
    name: "职场同事",
    ext: {
        id: "/vodtype/48",

    },

},{
    name: "女神学生",
    ext: {
        id: "/vodtype/44",

    },

},{
    name: "空姐模特",
    ext: {
        id: "/vodtype/50",

    },

},{
    name: "主播大秀",
    ext: {
        id: "/vodtype/49",

    },

},{
    name: "车震野合",
    ext: {
        id: "/vodtype/123",

    },

},{
    name: "美熟少妇",
    ext: {
        id: "/vodtype/51",

    },

},{
    name: "自慰群交",
    ext: {
        id: "/vodtype/52",

    },

},{
    name: "三级片区",
    ext: {
        id: "/vodtype/71",

    },

},{
    name: "刘玥",
    ext: {
        id: "/vodtype/137",

    },

},{
    name: "欧美精选",
    ext: {
        id: "/vodtype/94",

    },

},{
    name: "MDUS系列",
    ext: {
        id: "/vodtype/105",

    },

},
	],
}
async function getConfig() {
	return jsonify(appConfig)
}







async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
  
    const url =`${appConfig.site}${id}-${page}.html`
 
    const { data } = await $fetch.get(url, {
        headers:  {
            'User-Agent': UA,
         //  "Cookie": cookie 
            },
    })
    
    const $ = cheerio.load(data)


	  


  // 选择目标 <ul> 下的 <li>

   $('ul.hl-vod-list.hl-wide-list.clearfix > li.hl-list-item').each((index, element) => {


    const linkElement = $(element).find('a.hl-item-thumb'); // 定位 <a> 标签
    const href = linkElement.attr('href'); // 提取 href
    
    const title = linkElement.attr('title'); // 提取 title


    const dataOriginal = linkElement.attr('data-original'); // 提取 data-original
    const state = $(element).find('span.state').text().trim(); // 提取状态文字


   const xx = title.split('-')

   const result = dataOriginal.startsWith("http://") || dataOriginal.startsWith("https://") ? dataOriginal : `${appConfig.site}${dataOriginal}`;

        cards.push({
            vod_id: href,
            vod_name: xx[xx.length - 1] ,
            vod_pic: result ,
            vod_duration: '',
            vod_remarks: state,
            ext: {
                url: href,
            },
        })
    })


if (cards.length <= 0) { 
	$utils.openSafari(appConfig.site, UA);
	  }

    return jsonify({
        list: cards,
    })
}








async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []	
    let url =appConfig.site+ ext.url
    //$utils.toastError(jsonify(url));
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
          //  "Cookie": cookie 
        },
    })

    const $ = cheerio.load(data)
    const scriptContent = $('script:contains("player_aaaa")').text()
    eval(scriptContent)
    const url_id= player_aaaa.url
//$utils.toastError(jsonify(player_aaaa.vod_data.vod_name));

        tracks.push({
            name:player_aaaa.vod_data.vod_name,
            pan: '',
           ext: {
                        url:url_id,
                    }, 
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
   	  
	return jsonify({ urls: [ext.url] })
}






async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/vodsearch/${text}----------${page}---.html`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
              "Cookie": cookie 
        },
    })

    const $ = cheerio.load(data)

   $('li.hl-list-item').each((index, element) => {
  const href = $(element).find('a.module-card-item-poster.topicpage').attr('href'); // 提取 href
  const text = $(element).find('strong').text(); // 提取 strong 标签内文本
  const imgSrc = $(element).find('img').attr('data-original'); 
  const result = imgSrc.startsWith("http://") || imgSrc.startsWith("https://") ? imgSrc : `${appConfig.site}${imgSrc}`;
  
        cards.push({
            vod_id: href,
            vod_name: text,
            vod_pic: result,
            vod_duration: '',
            vod_remarks:"",
            ext: {
                url:href,
            },
        })
    })

    return jsonify({
        list: cards,
    })
}
