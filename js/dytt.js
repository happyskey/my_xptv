//昊
//2025-3-16
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

let appConfig = {
    ver: 1,
    title: '电影天堂',
    site: 'https://cgi.dytt8vip.com',
}

async function getConfig() {
    let config = appConfig
    config.tabs = await getTabs()
    return jsonify(config)
}

async function getTabs() {
    let list = []
    let ignore = []


    const data = await $fetch.get(`${appConfig.site}/index`, {
        headers: {
            'User-Agent': UA,
        },
    })


    argsify(data.data).data.category.children.forEach(child => {
        const name = child.name
        const href = `${child.id}`




        list.push({
            name,
            ext: {
                id: href,
            },
        })
    })

    return list
}




async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id} = ext
    const url = appConfig.site + `/filmClassifySearch?Pid=${id}&Category=0&current=${page}`
    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const videos_list =argsify(data.data).data.list

    videos_list.forEach(e=> {

        cards.push({
            vod_id: `${e.id}`,
            vod_name: e.name,
            vod_pic: e.picture,
            vod_remarks: e.remarks,
            ext: {
                number:`${e.id}`,
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

    let url =appConfig.site+`/filmPlayInfo?id=${ext.number}`// 

$utils.toastError(jsonify( url))

    const data= await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })


const void_line = argsify(data.data).data.detail.list

        
    void_line.forEach(item => {

        let group = {
            title: item.name,
            tracks: [],
        };



        item.linkList.forEach(ele => {
            

            group.tracks.push({
                name: ele.episode,
                pan: '',
                ext: {
                    url: `${ele.link}`,
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
let { page = 1} = ext
    let text = encodeURIComponent(ext.text)
    
    let url = `${appConfig.site}/searchFilm?keyword=${text}&current=${page}`

    const data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
  const videos_list =argsify(data.data).data.list

    videos_list.forEach(e=> {


        const pic=e.picture||'NV'

        cards.push({
            vod_id: `${e.pid}`,
            vod_name:e.name,
            vod_pic: pic,
            vod_remarks: e.remarks,
            ext: {
                number:`${e.id}`,
            },

        })


    })



    return jsonify({
        list: cards,
    })
}


