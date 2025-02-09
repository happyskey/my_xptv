//昊转译
const cheerio = createCheerio()
const CryptoJS = createCryptoJS()


const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'



let appConfig = {
    ver: 1,
    title: '555影视',
    site: 'https://www.wuwugo.life',
    tabs: [
        {
            name: '首页推荐',
            ext: {
                id: '/index/home',
            },
        },{
            name: '电影',
            ext: {
                id: '/vodshow/1',
            },
        },{
            name: 'netflix',
            ext: {
                id: '/label/netflix/page/',
            },
        },{
            name: '电视剧',
            ext: {
                id: '/vodshow/2',
            },
        },{
            name: '动漫',
            ext: {
                id: '/vodshow/4',
            },
        },{
            name: '综艺',
            ext: {
                id: '/vodshow/3',
            },
        },{
            name: '福利',
            ext: {
                id: '/vodshow/124',
            },
        },



    ],
}

async function getConfig() {
    return jsonify(appConfig)
}

async function getCards(ext) {


let cards = []

    ext = argsify(ext)
    
    
    let { id, page = 1 } = ext
    if(id!='/index/home'){

 //$utils.toastError(jsonify(id));

    let url = `${appConfig.site}${id}--------${page}---.html`


    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },


    })

  const $ = cheerio.load(data);

   $('.module-poster-item.module-item').each((index, element) => { 
        const href = $(element).attr('href');
        const title = $(element).find('.module-item-pic img').attr('alt');
        const cover= $(element).find('.module-item-pic img').attr('data-original');
        const remarks = $(element).find('.module-item-note').text().trim();
        const douban = $(element).find('.module-item-douban').text().trim();
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


}else{



//

  let url = `${appConfig.site}${id}.html`
 $utils.toastError(jsonify(url));

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },


    })

  const $ = cheerio.load(data);

   $('.module').each((index, element) => {  
      const list_little = $(element).find('.module-title').text().trim();
  
      let posterItems;
      if (index === 0) {
          posterItems = $(element).find('.module-main').last().find('.module-poster-item');
      } else {
          posterItems = $(element).find('.module-poster-item');
      }
  
      posterItems.each((_, e) => {
          const href = $(e).attr('href');
          const title = $(e).find('.module-item-pic img').attr('alt');
          const cover = $(e).find('.module-item-pic img').attr('data-original');
          const remarks = $(e).find('.module-item-note').text().trim();
          const douban = $(e).find('.module-item-douban').text().trim();
  
          cards.push({
              vod_id: href,
              vod_name: `${list_little}:${title}`, 
              vod_pic: cover,
              vod_remarks: remarks,
              ext: {
                  url: `${appConfig.site}${href}`, 
              },
          });
      });
  });
  


//



}
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

    const void_line = [];
     $('.module-tab-item.tab-item').each((index, element) => {  


      const void_title = $(element).find('span').text().trim();
      void_line.push(void_title)

    })



   // $utils.toastError(jsonify(lines));
     $('.module-list.sort-list.tab-list.his-tab-list').each((index, element) => {  

     console.log(index)

     let group = {
        title: void_line[index],
        tracks: [],
      };

      $(element).find('a.module-play-list-link').each((_, e) => {

      

        const href = $(e).attr('href')
        const matchVal = href.match(/\/vodplay\/(\d+-\d+-\d+)\.html/)
        const val = matchVal[1]
        const arr = val.split('-');
        const [id, sid, nid] = arr

           group.tracks.push({
                name: $(e).attr('title'),
                pan: '',
                ext: {
                    url: `${appConfig.site}/voddisp/id/${id}/sid/${sid}/nid/${nid}.html`,
                },
            });


      })

if (group.tracks.length > 0) {
            groups.push(group);
        }

      
    })

//$utils.toastError(jsonify(groups));


    return jsonify({ list: groups });
}





async function getPlayinfo(ext) {
    ext = argsify(ext);
    let url = `https://555dy.terra.us.kg/?url=${ext.url}`;
    const data= await $fetch.get(url, {

    });


                $utils.toastError(jsonify(data.data.replace(/["\\]/g, '')));

	return jsonify({ urls: [data.data.replace(/["\\]/g, '')] })
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
        },
    })

    const $ = cheerio.load(data)

      $('.module-card-item').each((index, element) => {  
       
        const href =$(element).find('a').attr('href')
      
        const title =  $(element).find('.module-card-item-title strong em').parent().text().trim();
        const cover=   $(element).find('img').attr('data-original')
        const remarks =$(element).find('.module-item-note').text().trim();
       // const type = $(element).find('.module-card-item-class').text().trim();
        cards.push({
            vod_id:   href,
            vod_name: title,
            vod_pic:  cover,
            vod_remarks: remarks,
            ext: {
                url: `${appConfig.site}${href}`,
            },
        })
    })
     //$utils.toastError(jsonify(cards));
    return jsonify({
        list: cards,
    })
}






