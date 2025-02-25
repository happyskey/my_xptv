//昊-在线播放未添加
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '剧集TV-online|昊',
    site: 'https://www.tvjuji.cc',
    tabs: [
        {
            name: '韩剧',
            ext: {
                id: 1,
            },
        },
        {
            name: '陆剧',
            ext: {
                id: 6,
            },
        },
        {
            name: '日剧',
            ext: {
                id: 2,
            },
        },
        {
            name: '美剧',
            ext: {
                id: 3,
            },
        },{
            name: '泰剧',
            ext: {
                id: 4,
            },
        },{
            name: '港剧',
            ext: {
                id: 7,
            },
        },{
            name: '台剧',
            ext: {
                id: 39470,
            },
        },{
            name: '短剧',
            ext: {
                id: 9,
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

    const url = appConfig.site + `/show/${id}--------${page}---.html`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)

    const videos = $('li.m-item')
    videos.each((_, e) => {

        const href = $(e).find('a.thumb').attr('href');  
        const title = $(e).find('a.thumb').attr('title');
        const cover = $(e).find('img').attr('data-original');
        const remarks = $(e).find('span.label').text().trim(); 

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

 let line_list =[]
    $('ul.nav.nav-tabs.dpplay.pull-right a').each((_,el)=>{

    
        const href = $(el).attr('href');
        const text = $(el).text().trim();

        line_list.push(text)


    })



  


    

    $('div.tab-pane.fade.clearfix').each((index, element) => {  
      console.log(index)

      let group = {
        title: line_list[index],
        tracks: [],
      };

      $(element).find('li').each((xx,ele)=>{  
       if(!$(ele).find('a').attr('rel')){  

        group.tracks.push({
          name:$(ele).find('a').text().trim(),
          pan:'',
          ext:{

            url:`${appConfig.site}${$(ele).find('a').attr('href')}`
          }

        })
      }
      })
      if (group.tracks.length > 0) {
        groups.push(group);
    }
  
  })
        return jsonify({ list: groups });




  }






async function getPlayinfo(ext) {
    ext = argsify(ext);
    let url = ext.url;
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    });
    const $ = cheerio.load(data);


    const scriptContent = $('script:contains("player_aaaa")').text()
              


   eval(scriptContent)
   const url_id= player_aaaa.url



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

const $ = cheerio.load(data);

    $('li.m-item').each((index,el)=>{

      const href = $(el).find('a.thumb').attr('href')

      cards.push({
        vod_id : href,
        vod_remarks:$(el).find('a.thumb').text().trim(),
        vod_pic : `${appConfig.site}$(el).find('img.quic.lazy').attr('data-original')`,
        vod_name :  $(el).find('a.thumb').attr('title'),
         ext: {
                url: `${appConfig.site}${href}`,
            },

       } )


    })

	
	return jsonify({
		list: cards,
	})
}





