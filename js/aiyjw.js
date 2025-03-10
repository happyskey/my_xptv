//昊
//2025-3-10
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const UC = 'https://player.heimuer.tv/index.html?url='
const appConfig = {
    ver: 1,
    title: '爱影剧网',
    site: 'https://www.2yjw.com',
    tabs: [
        {
            name: '日韩剧',
            ext: {
                id: '/vodtype/15',
            },
        },
        {
            name: '欧美剧',
            ext: {
                id: '/vodtype/16',
            },
        },
        {
            name: '泰剧',
            ext: {
                id: '/vodtype/2',
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
    const url = appConfig.site + `${id}-${page}.html`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos_list = $("li.col-md-2.col-sm-3.col-xs-4")
    videos_list.each((_, e) => {

        const href = $(e).find('a.video-pic.loading').attr('href')
        const title = $(e).find('a.video-pic.loading').attr('title') || ''
        const img = $(e).find('a.video-pic.loading').attr('data-original') || ''
        const remarks = $(e).find('span.note.text-bg-r').text().trim() || ''
        console.log(remarks)
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

    const line = []

    const line_title = $('ul.dropdown-menu').find('a.gico')
    line_title.each((_, el) => {

        $(el).text().trim()
        line.push({ line: $(el).attr('href').match(/#con_playlist_(\d+)/)[1], name: $(el).text().trim() })

    })
    line.forEach((item) => {
        let group = {
            title: item.name,
            tracks: [],
        };


        void_list = $(`ul#con_playlist_${item.line} a`)


        void_list.each((index, e) => {
            console.log(index);

            group.tracks.push({
                name: $(e).text().trim(),
                pan: '',
                ext: {
                    url: `${appConfig.site}${$(e).attr('href')}`,
                },
            });

        });


        if (group.tracks.length > 0) {
            groups.push(group);
        }



    })


    return jsonify({ list: groups })
}






async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    const other_data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })



    const new_html = cheerio.load(other_data.data)
    const scriptContent = new_html('script:contains("player_aaaa")').text()
    //const Regex = /"url":"(.*?)"/;//
    //const url_id = scriptContent.match(Regex)[1].replace(/\\/g, "")
    eval(scriptContent)
    let url_id = player_aaaa.url
    url_id = decodeURIComponent(url_id)

    return jsonify({ urls: [url_id] })





}

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

    $('div.details-info-min.col-md-12.col-sm-12.col-xs-12.clearfix.news-box-txt.p-0').each((index, element) => {  // 这里必须是个列表class
        console.log(index)
        const href = $(element).find('a.video-pic.loading').attr('href')
        const title = $(element).find('a.video-pic.loading').attr('title')
        const cover = $(element).find('a.video-pic.loading').attr('data-original')//短连接
        const remarks = $(element).find('span.hidden-sm.hidden-md.hidden-lg').text().trim();

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





