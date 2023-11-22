

let currentHref = ""
setInterval(async function () {
	if (location.href == currentHref) {
		return
	}
	currentHref = location.href
	if (location.href.startsWith("https://devops.inshopline.com/ci-cd")) {
		await update()
	}
},1000)


document.addEventListener('DOMContentLoaded', async function() {
	await update()
})

async function update() {
	console.log("tab-camouflage update")
	const href = location.href;
	const origin = location.origin;
	const urls = await getCamouflageList()
	const urlFilter = urls.filter(item => href.includes(item.url))
	if (urlFilter.length && urlFilter[0].status) {
		setTabIcon(urlFilter[0].icon)
		setTimeout(function (){
			setTabTitle(href, urlFilter[0].memo)
		}, 1000)
	}
}

function removeHttp(text) {
	// 删除url中的http(s)
	return text.replace('http://', '').replace('https://', '')
}

function getCamouflageList() {
	// 获取配置列表
	return new Promise(resolve => {
		chrome.runtime.sendMessage({
			name: "getCamouflageList"
		}, function (res) {
			resolve(res)
		})
	})
}

function setTabTitle(href, title) {
	// 修改页面标题
	title = title || ""
	if (!title.startsWith("{")) {
		document.title = title
		return
	}
	var regex = /{([^}]+)}/;
	var match = title.match(regex);
	let key = match[1];

	let regexStr = key+"=([^&]+)";
	let valueRegex = new RegExp(regexStr);

	var value = href.match(valueRegex)[1];
	document.title = value
}

function setTabIcon(iconUrl) {
	// 修改页面图标
	let links = document.querySelectorAll("link[rel*='icon']");
	links.forEach(node => {
		node.parentNode.removeChild( node )
	})
	let link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = iconUrl;
	document.getElementsByTagName('head')[0].appendChild(link);
}