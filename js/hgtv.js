//昊
//2025-3-8修改个别视频隐藏连接获取
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const UC = 'https://player.heimuer.tv/index.html?url='
const appConfig = {
    ver: 1,
    title: '海龟TV',
    site: 'https://www.haigui.tv',
    tabs: [
        {
            name: '电影',
            ext: {
                id: 'dianying',
            },
        },
        {
            name: '电视剧',
            ext: {
                id: 'dianshiju',
            },
        },
        {
            name: '综艺',
            ext: {
                id: 'zongyi',
            },
        },
        {
            name: '动漫',
            ext: {
                id: 'dongman',
            },
        }, {
            name: '短剧',
            ext: {
                id: 'duanju',
            },
        }, {
            name: '纪录片',
            ext: {
                id: 'jilupian',
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
    const url = appConfig.site + `/show/${id}/page/${page}/`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-item')
    videos.each((_, e) => {
        const item = $(e);
        const link = item.find('.module-item-pic a');
        const title = link.attr('title') || 'N/A';
        const href = link.attr('href') || 'N/A';
        const img = item.find('.module-item-pic img');
        const cover = img.attr('data-src') || 'N/A';
        const remarks = item.find('.module-item-text').text().trim() || 'N/A';
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks,
            ext: {
                url: `${appConfig.site}${href}/`,
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



    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })




    const $ = cheerio.load(data)

    const TV_line = $('div.module-tab-item')
    const TV_list = $('div.scroll-content a')
    let key = 1
    TV_line.each((_, e) => {

        console.log($(e).attr('data-dropdown-value'))

        let group = {
            title: $(e).attr('data-dropdown-value'),
            tracks: [],
        };


        TV_list.each((index, el) => {

            const href = $(el).attr('href') || 'N/A'
            if (href.includes('play')) {
                const name = $(el).text() || 'N/A'
                const id_key = href.match(/-(\d+)-/)[1]
                console.log(`${name}:${href}`)



                if (key.toString() === id_key) {
                    console.log(`${id_key}==${key}`)
                    group.tracks.push({
                        name: name.trim(),
                        pan: '',
                        ext: {
                            url: `${appConfig.site}${href}`,
                        },
                    });

                }//if

            }
        })

        if (group.tracks.length > 0) {
            groups.push(group)
        }
        key = key + 1


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
    
    if (url_id.includes('.html')) {


        $utils.toastError(jsonify(url_id))

        const new_data = await $fetch.post('https://svip.qlplayer.cyou/admin/mizhi_json.php', {
            url: url_id,
            time: new Date().getTime(),
            key: '',
            vkey: '',
        }, {
            headers: {
                "Host": "svip.qlplayer.cyou",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-Fetch-Site": "same-origin",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Sec-Fetch-Mode": "cors",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://svip.qlplayer.cyou",
                "User-Agent": UA,
                "Connection": "keep-alive",
                "Sec-Fetch-Dest": "empty"
            },
        });



        url_id = argsify(new_data.data).url
    }
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

    const videos = $('.module-search-item')
    videos.each((_, e) => {
        const href = $(e).find('a.video-serial').attr('href')

        const title = $(e).find('img').attr('alt')

        const cover = $(e).find('img').attr('data-src')
        const remarks = $(e).find('a.video-serial').text().trim()


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





