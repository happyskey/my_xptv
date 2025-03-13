//昊
//2025-3-13
//搜索需cloudflare 顾未提供
//由于线路与剧集倒置导致表单也倒置
const cheerio = createCheerio()


const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: 'vidhub|昊',
    site: 'https://vidhub.icu',
    tabs: [
        {
            name: '陆剧',
            ext: {
                id: '/chinese-mainland',
            },
        },
        {
            name: '美剧',
            ext: {
                id: '/united-states',
            },
        },
        {
            name: '韩剧',
            ext: {
                id: '/south-korea',
            },
        },
        {
            name: '电影',
            ext: {
                id: '/movie',
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
  

    const url = appConfig.site + `${id}/page/${page}/`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)

     const videos_list =$("div.col-4.col-sm-3.col-lg-3.col-xl-2")
 
       videos_list.each((index,el)=> {
   
   
   cards.push({
               vod_id: $(el).find("a").attr("href"),
               vod_name: $(el).find("img.lozad").attr("alt"),
               vod_pic: $(el).find("img.lozad").attr("data-src"),
               vod_remarks: $(el).find("span.label.text-truncate").text().trim(),
               ext: {
                   url: `${$(el).find("a").attr("href")}`,
               },
           })
           

 })

    return jsonify({
        list: cards,
    })
}



async function getTracks(ext) {
    ext = argsify(ext);

    let groups = [];
    let url = ext.url;
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    });
    const $ = cheerio.load(data);

     const void_list = $('div.ep-item.col-3.col-sm-2.col-lg-2.col-xl-1');
    for (let i = 0; i < void_list.length; i++) {
      const e = $(void_list[i]);
      const episodeUrl = e.find('a.ep-btn').attr('href');

      let group = {
        title: e.find('a.ep-btn').attr('title'), 
        tracks: [],         
    };

      
  
      const playUrls = await get_void(episodeUrl);

      for (const key in playUrls) {

        group.tracks.push({
          name: `${key}`,
          pan: '',
          ext: {
              url: `${playUrls[key]}`,
          },
      });

      
      }
      if (group.tracks.length > 0) {
        groups.push(group);
    }
    }


    return jsonify({ list: groups });
}

async function getPlayinfo(ext) {
    ext = argsify(ext);
    let url = ext.url;
    
	return jsonify({ urls: [url] })
}


async function get_void(url) {

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    });
    const $ = cheerio.load(data);

    const scriptContent = $('script:contains("playUrls")').html()

        const objPart = scriptContent.match(/{[\s\S]*?}/)[0];
        const sanitized = objPart.replace(/\\\//g, '/');
        return JSON.parse(sanitized);
 
}
