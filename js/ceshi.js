
//老登
const cheerio = createCheerio()
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
const headers = {
  'Referer': 'https://anime.girigirilove.com/',
  'Origin': 'https://anime.girigirilove.com',
  'User-Agent': UA,
}

const appConfig = {
  ver: 1,
  title: "ギリギリ动漫",
  site: "https://anime.girigirilove.com",
  tabs: [{
    name: '日番',
    ext: {
      url: 'https://anime.girigirilove.com/show/2--------{page}---/'
    },
  }, {
    name: '美番',
    ext: {
      url: 'https://anime.girigirilove.com/show/3--------{page}---/'
    },
  }, {
    name: '剧场版',
    ext: {
      url: 'https://anime.girigirilove.com/show/21--------{page}---/'
    },
  }]
}

async function getConfig() {
    return jsonify(appConfig)
}

async function getCards(ext) {
  ext = argsify(ext)
  let cards = []
  let url = ext.url
  let page = ext.page || 1
  url = url.replace('{page}', page)

  const { data } = await $fetch.get(url, {
    headers
  })

  const $ = cheerio.load(data)
  $('a.public-list-exp').each((_, each) => {
    cards.push({
      vod_id: $(each).attr('href'),
      vod_name: $(each).attr('title'),
      vod_pic: appConfig.site + $(each).find('img.gen-movie-img').attr('data-src'),
      vod_remarks: $(each).find('.public-list-prb').text(),
      ext: {
        url: appConfig.site + $(each).attr('href'),
      },
    })
  })

  return jsonify({
      list: cards,
  });
}


