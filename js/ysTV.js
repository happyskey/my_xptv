//昊
//2025-3-10
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '影视TV',
    site: 'https://api.yingshi.tv',
    tabs: [
        {
            name: '电视剧',
            ext: {
                id: 1,
            },
        },
        {
            name: '电影',
            ext: {
                id: 2,
            },
        },
        {
            name: '综艺',
            ext: {
                id: 3,
            },
        },
        {
            name: '动画',
            ext: {
                id: 4,
            },
        },
        {
            name: '纪录片',
            ext: {
                id: 5,
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

    const url = appConfig.site + `/vod/v1/vod/list?order=desc&limit=30&tid=${id}&by=time&page=${page}`
    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    //const $ = cheerio.load(data)

    const videos_list = argsify(data.data).data.List
    //$utils.toastError(jsonify(videos_list));
    videos_list.forEach(e => {


        const pic = e.vod_pic || 'NV'
        if (pic != 'NV') {
            cards.push({
                vod_id: `${e.vod_id}`,//不能纯数字
                vod_name: e.vod_name,
                vod_pic: e.vod_pic,
                vod_remarks: e.vod_remarks,
                ext: {
                    change: [id, e.vod_id],//不能纯数字
                },

            })
        }

    })


    //$utils.toastError(jsonify( cards))
    return jsonify({
        list: cards,
    })
}







//

async function getTracks(ext) {

    ext = argsify(ext)
    let groups = []

    let url = appConfig.site + `/vod/v1/info?id=${ext.change[1]}&tid=${ext.change[0]}`// 

    $utils.toastError(jsonify(url))

    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })


    const void_line = argsify(data.data)//.data.vod_sources






    void_line.forEach(item => {

        //$utils.toastError(jsonify( item.source_name))
        let group = {
            title: item.source_name,
            tracks: [],
        };


        //$utils.toastError(jsonify(  typeof item.vod_play_list)) 
        item.vod_play_list.urls.forEach(ele => {


            group.tracks.push({
                name: ele.name,
                pan: '',
                ext: {
                    url: `${ele.url}`,
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


    return jsonify({ urls: [url] })





}

async function search(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1 } = ext
    let text = encodeURIComponent(ext.text)

    //https://api.yingshi.tv/vod/v1/search?wd=%E5%A5%B3&limit=20&page=1
    let url = `${appConfig.site}/vod/v1/search?wd=${text}&limit=20&page=${page}`

    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const videos_list = argsify(data.data).data.List

    videos_list.forEach(e => {

        //$utils.toastError(jsonify(e.vod_year));
        const pic = e.vod_pic || 'NV'
        if (pic != 'NV') {
            cards.push({
                vod_id: `${e.vod_id}`,//不能纯数字
                vod_name: e.vod_name,
                vod_pic: e.vod_pic,
                vod_remarks: `${e.vod_year}`,
                ext: {
                    change: [e.type_id, e.vod_id],//不能纯数字
                },

            })
        }

    })

    //$utils.toastError(jsonify(cards));

    return jsonify({
        list: cards,
    })
}


