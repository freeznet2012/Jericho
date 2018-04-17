chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(tab.id, {
		file: "jquery-3.3.1.min.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "stopwords.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "loadingoverlay.min.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "jv3.js"
	});
	chrome.tabs.executeScript(tab.id, {
		file: "content.js"
	});
});