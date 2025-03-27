//昊
//2025-3-27
const cheerio = createCheerio()

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
	ver: 1,
	title: '老地方',
	site: 'https://www.laodifang.tv',
	tabs: [
		{
			name: '電影',
			ext: {
				id: 1,
			},
		},
		{
			name: '劇集',
			ext: {
				id: 2,
			},
		},
		{
			name: '動漫',
			ext: {
				id: 4,
			},
		},
		{
			name: '綜藝',
			ext: {
				id: 3,
			},
		},
		{
			name: '短劇',
			ext: {
				id: 20,
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

	const url = appConfig.site + `/vodtype/${id}-${page}.html`
	const { data } = await $fetch.get(url, {
		headers: {
			'User-Agent': UA,
		},
	})

	const $ = cheerio.load(data)

	$("div.module-item").each((index, e) => {
		console.log(index)
		const href = $(e).find('a.module-item-title').attr('href') || ''
		const title = $(e).find('a.module-item-title').attr('title') || ''
		const img = $(e).find('img.lazy.lazyloaded').attr('data-src') || ''

		const remarks = $(e).find('div.module-item-text').text().trim() || ''
		cards.push({
			vod_id: href,
			vod_name: title,
			vod_pic: img,
			vod_remarks: remarks,
			ext: {
				url: `${appConfig.site}${href}`,
				name: title,
			},

		})

	})
	return jsonify({
		list: cards,
	})
}

async function getTracks(ext) {
	ext = argsify(ext)
	let groups = [];
	let url = ext.url

	const { data } = await $fetch.get(url, {
		headers: {
			'User-Agent': UA,
		},
	})

	const $ = cheerio.load(data)


	const line_list = []
	const line_change = $('div.module-tab-item.tab-item')


	line_change.each((index, el) => {

		line_list.push($(el).attr('data-dropdown-value'))

	})

	$('div.scroll-content').eq(1).each((num, el) => {
		//$utils.toastError(jsonify(line_list[num]));
		let group = {
			title: `${line_list[num]}`,
			tracks: [],
		};

		const void_list = $('div.module-blocklist.scroll-box.scroll-box-y').find('div.scroll-content a');
		void_list.each((index, e) => {
			console.log(index)


			const href = $(e).attr('href')



			//$utils.toastError(jsonify(ext.name));


			group.tracks.push({
				name: `${$(e).attr('title').replace('播放', '').replace(ext.name, '')}`,
				pan: '',
				ext: {
					url: `${appConfig.site}${href}`,
				},
			});

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


	const url_id = $('div.player-info a#bfurl').attr('href')


	//$utils.toastError(jsonify( url_id));

	return jsonify({ urls: [url_id] })
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

	$('div.module-search-item').each((index, element) => {

		const href = $(element).find('a.btn-important.btn-base').attr('href')
		const title = $(element).find('a.video-serial').attr('title')
		const cover = $(element).find('img.lazy.lazyload').attr('data-src')
		const remarks = $(element).find('a.tag-link').attr('title');

		cards.push({
			vod_id: href,
			vod_name: title,
			vod_pic: cover,
			vod_remarks: remarks,
			ext: {
				url: `${appConfig.site}${href}`,
				name: title,
			},
		})
	})
	return jsonify({
		list: cards,
	})
}


