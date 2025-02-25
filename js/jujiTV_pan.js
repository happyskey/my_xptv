//昊-网盘
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '剧集TV|昊',
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
    let tracks 
  
    let url = ext.url;


    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    });
    const $ = cheerio.load(data);
									

    let urlString = $('div.detail-main-btn').find('a.hjtvui-btn.hjtvui-btn-radius').eq(1).attr('href')


    const regex = /wd=([^&]+)/;
    const match = urlString.match(regex)[1].split('=');
									
    const encodedValue = encodeURIComponent(match[0]);


   const newUrlString = urlString.replace(regex, `wd=${encodedValue}`);

 									

  tracks  =await getPan_url(newUrlString ) 
  return jsonify({
		list: [
			{
				title: '默认分组',
				tracks,
			},
		],
	}) 


  }

async function getPan_url(url) {
  let track = []
  let { data } = await $fetch.get(url, {
    headers: {
      'User-Agent': UA,
    },
  })
  const $ = cheerio.load(data);
  const videos = $('.pianyi li')

  for (const e of videos) {

    const pan_name = $(e).text().trim()
    const pan_url = `https://www.jujizy.com${$(e).find('a').attr('href')}`
    let pan = await getPan(pan_url)

    pan.forEach((item) => {
      track.push({
        name: pan_name,//item.text,
        pan: item.href,
        ext: {
          url: '',
        },
      })
    })

  }

if(!track){

$utils.toastError(jsonify( track))

}

  return track




}

async function getPan(url) {
  const { data } = await $fetch.get(url, {
    headers: {
      'User-Agent': UA,
    },
  })
  const $ = cheerio.load(data);
  const links = $('a[rel="nofollow"]').map((index, element) => {
    const href = $(element).attr('href');
    const text = $(element).find('p').text();
    return { href, text };
  }).get();

  if (links.length === 0 || links[0].href === '' || links[0].text === '') {
    const relatedResource = $('.content p a');
    if (relatedResource.length > 0) {
      const href = relatedResource.attr('href');
      const text = relatedResource.text();
      return [{ href, text }];
    }
  }

  return links;
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

