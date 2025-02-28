const cheerio = createCheerio()

// 设置User Agent，模拟iPhone浏览器
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
let appConfig = {
    ver: 1,
    title: 'naixxzy',
    site: 'https://naixxzy.com',
}

async function getConfig() {
    let config = appConfig
    config.tabs = await getTabs()
    return jsonify(config)
}

async function getTabs() {
    let list = []


    const data = await $fetch.get(`${appConfig.site}/api.php/provide/vod/?ids=recommend`, {
        headers: {
            'User-Agent': UA,
        },
    })
    const vod_list = argsify(data.data)

    vod_list.class.forEach((child,index) => {
    if(!child.type_name.includes("精")&&index<26){
        const name = child.type_name 
        const href = child.type_id

        list.push({
            name,
            ext: {
                id: href,
            },
        })

}

    })

    return list
}





async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let { page = 1, id } = ext
const url = appConfig.site + `/api.php/provide/vod/?ac=videolist&t=${id}&pg=${page}&h=&ids=&wd=`

    const  data = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

const vod_list = argsify(data.data)

vod_list.list.forEach(child => {
       
        const vod_id =`${child.vod_id}`||'N/A';
        const title = child.vod_name||'N/A';
        const cover = child.vod_pic.split('?')[0]||'N/A';
        const subTitle =child.vod_class||'N/A';
        const hdinfo = child.vod_pubdate||'N/A';
    if(vod_id!=='N/A'||title!=='N/A'||cover!=='N/A'){
        cards.push({
            vod_id: vod_id,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: subTitle ,
            ext: {
                url: child.vod_play_url.split('$')[1] ,
            },
        })

}
        
    })

    return jsonify({
        list: cards,
    })
}




async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let url = ext.url
  
    tracks.push({
        name: '播放',
        pan: '',
        ext: {
            url: url ,
        },
    })

    return jsonify({
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
}

async function getPlayinfo(ext) {
    ext = argsify(ext)
    const url = ext.url





    return jsonify({ urls: [url], headers: [{ 'User-Agent': UA }] })
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    let text = encodeURIComponent(ext.text)
    let page = ext.page || 1
    let url = `${appConfig.site}/api.php/provide/vod/?ac=videolist&t=&pg=${page}&h=&ids=&wd=${text}`

    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

   const vod_list = argsify(data)


$utils.toastError(jsonify( vod_list ))


vod_list.list.forEach(child => {
       
        const vod_id =`${child.vod_id}`||'N/A';
        const title = child.vod_name||'N/A';
        const cover = child.vod_pic.split('?')[0]||'N/A';
        const subTitle =child.vod_class||'N/A';
        const hdinfo = child.vod_pubdate||'N/A';
    if(vod_id!=='N/A'||title!=='N/A'||cover!=='N/A'){
        cards.push({
            vod_id: vod_id,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: subTitle ,
            ext: {
                url: child.vod_play_url.split('$')[1] ,
            },
        })

}
        
    })

    return jsonify({
        list: cards,
    })
}
