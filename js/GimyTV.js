//昊
//剔除天空线路
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const UC ='https://player.heimuer.tv/index.html?url='
const appConfig = {
    ver: 1,
    title: 'gimy剧迷',
    site: 'https://gimy.tv',
    tabs: [
        {
            name: '电影',
            ext: {
                id: 'genre/1',
            },
        },
        {
            name: '电视剧',
            ext: {
                id: 'genre/2',
            },
        },
        {
            name: '综艺',
            ext: {
                id: 'genre/3',
            },
        },
        {
            name: '动漫',
            ext: {
                id: 'genre/4',
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
    const url =appConfig.site + `/${id}---${page}.html` 
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
   const videos_list = $("li.col-lg-6.col-md-6.col-sm-4.col-xs-3")
    videos_list.each((_, e) => {
      const href = $(e).find('a.myui-vodlist__thumb.lazyload').attr('href')
      const title = $(e).find('a.myui-vodlist__thumb.lazyload').attr('title')||''
      const img = $(e).find('a.myui-vodlist__thumb.lazyload').attr('data-original')||''
      const remarks =$(e).find('span.pic-text.text-right').text().trim()||''
      cards.push({
        vod_id: href,
        vod_name: title,
        vod_pic: img,
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
async function getTracks(ext) {
    
    ext = argsify(ext)
   let groups = []
    
    let url = ext.url
    $utils.toastError(jsonify(url));
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
      let line = []
    const line_title = $('h3.title')
    line_title.each((_, el) => {
      const change = $(el).text().trim()
      if (change.includes('路')) {
        line.push(change)
      }

    })
    let video_list = []

    const void_list = $('li.col-lg-8.col-md-7.col-sm-6.col-xs-4')

    void_list.each((_, e) => {

     
      video_list.push({ href: $(e).find('a.btn.btn-default').attr('href'), name: $(e).find('a.btn.btn-default').text().trim() })
    })



if (video_list.every(() => false)) { 
     const void_list =$('li.col-lg-6.col-md-5.col-sm-4.col-xs-2')
    void_list.each((_, e) => {
      video_list.push({ href: $(e).find('a.btn.btn-default').attr('href'), name: $(e).find('a.btn.btn-default').text().trim() })
    })

}

line = processDuplicates(line)


let label =0
    
const groupedEpisodes = await groupByMiddleNumber(video_list);
    

    for (const groupKey in groupedEpisodes) {

      if (groupedEpisodes.hasOwnProperty(groupKey)) {

if(!line[label].includes("天空")){
        let group = {
          title: line[label],
          tracks: [],
        };

        const episodes = groupedEpisodes[groupKey];
        episodes.forEach(episode => {
          const name = episode.name;
          const href = episode.href;
         group.tracks.push({
            name:  name,
            pan: '',
            ext: {
                url: `${appConfig.site}${href}`,
            },
        });

        });


        if (group.tracks.length > 0) {
          groups.push(group);
      }


      }

}

label=label+1

    }
   return jsonify({ list: groups })
}





async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
 //   $utils.toastError(jsonify(url));
const other_data  = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

      
 
const new_html =cheerio.load(other_data.data) 
const scriptContent = new_html('script:contains("player_data")').text()
   eval(scriptContent)
   const url_id= player_data.url
    return jsonify({ urls: [url_id] })
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/search/${text}----------${page}---.html`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const videos = $('li.clearfix')
    videos.each((_, e) => {
        const href = $(e).find('a.myui-vodlist__thumb.img-lg-150.img-md-150.img-sm-150.img-xs-100.lazyload').attr('href')      
        const title =  $(e).find('a.myui-vodlist__thumb.img-lg-150.img-md-150.img-sm-150.img-xs-100.lazyload').attr('title')        
        const cover = $(e).find('a.myui-vodlist__thumb.img-lg-150.img-md-150.img-sm-150.img-xs-100.lazyload').attr('data-original') 
        const remarks = $(e).find('span.pic-text text-right').text().trim()       
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



async function groupByMiddleNumber(data) { 
  const result = {};
  data.forEach(item => {
    const href = item.href;
    const regex = /ep-\d+-(\d+)-.*\.html$/;
    const match = href.match(regex);
    const middleNumber = match?.[1] ?? 'unknown';
    if (!result[middleNumber]) {
      result[middleNumber] = [];
    }
    result[middleNumber].push(item);
  });

  return result;
};


 function processDuplicates(array) {
  const countMap = {};      
  const replaceCount = {};  
  array.forEach(item => {
    countMap[item] = (countMap[item] || 0) + 1;
  });

  return array.map(item => {
    if (countMap[item] > 1) { 
      replaceCount[item] = (replaceCount[item] || 0) + 1;
      return item.replace('线', replaceCount[item].toString());
    }
    return item;
  });
}


