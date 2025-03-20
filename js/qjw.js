//昊
//2025-3-21
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const UC = 'https://player.heimuer.tv/index.html?url='
const appConfig = {
    ver: 1,
    title: '全集网',
    site: 'https://www.yijia5.com',
    tabs: [
        {
            name: '电影',
            ext: {
                id: '/dianying',
            },
        },
        {
            name: '连续剧',
            ext: {
                id: '/dianshiju',
            },
        },
        {
            name: '综艺',
            ext: {
                id: '/zongyi',
            },
        },
        {
            name: '动漫',
            ext: {
                id: '/dongman',
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
    const url = appConfig.site + `${id}_${page}.html`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    $(".pack-ykpack").each((index, e) => {

        const href = $(e).find('a.aplus-exp.ecimgbor').attr('href') || ''
        const title = $(e).find('a.aplus-exp.ecimgbor').attr('title') || ''
        const img = $(e).find('div.bj.eclazy').attr('data-original') || ''

        const remarks = $(e).find('div.pack-subtitle.cor3.hidden').text().trim() || ''
        //$utils.toastError(jsonify(img))
        if (img) {

            cards.push({
                vod_id: href,
                vod_name: title,
                vod_pic: img,
                vod_remarks: remarks,
                ext: {
                    url: `${href}`,
                },

            })
        }
    })

    //$utils.toastError(jsonify(cards))
    return jsonify({
        list: cards,
    })
}


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

    const line_list = []
    const line_change = $('div.play_source_tab.b-t.swiper-container1')

    line_change.each((index, el) => {

        line_list.push($(el).find('a.channelname.swiper-slide.active').text())

    })


    $('ul.content_playlist.cf').each((num, el) => {

        let group = {
            title: `${line_list[num]}`,
            tracks: [],
        };

        const void_list = $('a.t-u');

        void_list.each((index, e) => {



            const href = $(e).attr('href')


            const pattern = /\/play\/\d+-(\d+)-\d+\.html/;

            const matches = parseFloat(href.match(pattern)[1]);



            if (num === matches) {

                group.tracks.push({
                    name: `${$(e).text()}`,
                    pan: '',
                    ext: {
                        url: `${href}`,
                    },
                });
            }
        })


        if (group.tracks.length > 0) {
            groups.push(group);
        }

    })

    return jsonify({ list: groups })
}


async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url
    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })


    const $ = cheerio.load(data.data);



    const url_id = $("iframe#playPath").attr("src").split("=")[1]

    $utils.toastError(jsonify(url_id));

    return jsonify({ urls: [url_id] })
}



async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/search_${page}.html?search=${text}`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    $("li.search-list.cf").each((index, e) => {
        console.log(index)

        const href = $(e).find('a.aplus-exp.ecimgbor').attr('href') || ''
        const title = $(e).find('a.aplus-exp.ecimgbor').attr("title") || ''
        const img = $(e).find('.bj.eclazy').attr('data-original') || ''

        const remarks = $(e).find('span.pack-prb').text().trim() || ''

        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: img,
            vod_remarks: remarks,
            ext: {
                url: `${href}`,
            },

        })


    })
    return jsonify({
        list: cards,
    })
}



