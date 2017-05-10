import getStore from './initRedux.js';

const checkState = (state) => {
	return (state && state.rotorsData && state.rotorsData.xy);
};
/**
 * load last State
 * @return {object} saved state
 */
const defaultState= {
	"rotorsData": {"xy": [], "yz": [], "xz": []},
	"options": {"showAxes": false, "hasHSL": false, "showMoreControl": false, "progressedSteps": 360, "steps": 360}
};
export const loadState = () => {
	const url = window.location.search;
	let result = 0;
	if (url.length > 10) {
		try {
			const url = window.location.search;
			result = decodeURL(url);

		} catch (e) {
			//redirect to 404
		}
	}
	else {
		try {
			const serializedState = localStorage.getItem("state");
			if (serializedState === null) {
				result = undefined;
			}
			result = JSON.parse(serializedState);
		} catch (err) {
			result = undefined;
		}
	}
	return result? {...defaultState, ...result} : undefined;
	// return checkState(result) ? result : undefined;
};


/**
 * short name for some key in json
 */
const keyList=[
	{key:"rotorsData",zip:"R"},
	{key:"width",zip:"W"},
	{key:"step",zip:"S"},
	{key:"start",zip:"C"},
	{key:"isPlaying",zip:"P"},
	{key:"options",zip:"O"},
	{key:"hasHSL",zip:"H"},
	{key:"showAxes",zip:"A"},
	{key:"progressedSteps",zip:"I"},
	{key:"steps",zip:"J"},
	{key:"showMoreControl",zip:"G"},
	{key:"xy",zip:"D1"},
	{key:"yz",zip:"D2"},
	{key:"xz",zip:"D3"},
];
/**
 * some other character replacement which are not ok in url
 */
const replaceList=[
	{from:'true',to:'T'},
	{from:'false',to:'F'},
	{from:'{',to:'Q'},
	{from:'}',to:'X'},
	{from:'[',to:'E'},
	{from:']',to:'Z'},
	{from:',',to:'V'},
];
/**
 * shortening url
 */
const encodeURL = (state) => {
	let zipUrl=JSON.stringify(sanitizeState(state));
	for(var i=0;i<keyList.length;i++) {
		zipUrl=zipUrl.replace(new RegExp('"'+keyList[i].key+'":',"g"),keyList[i].zip);
	}
	for(var j=0; j<replaceList.length; j++) {
		var from=replaceList[j].from;
		if(from.length<2)from="\\"+from;
		zipUrl=zipUrl.replace(new RegExp(from,"g"),replaceList[j].to);
	}
	zipUrl="?" + encodeURIComponent(zipUrl);
	return zipUrl;
};
const isArray = (data) => {
	return (Object.prototype.toString.call(data) === "[object Array]");
};
const sanitizeState = (state) => {
	if (isArray(state)) {
		for (let sti of state) {
			sanitizeState(sti);
		}
	}
	else if(typeof(state)=='object') {
		for (let [k, v] of Object.entries(state)) {
			if (keyList.filter(x => x.key == k).length < 1) {
				delete state[k];
			}
			sanitizeState(state[k]);
		}
	}
	return state;
};
/**
 * decode url
 */
const decodeURL = (url) => {
	let decodedUrl = decodeURIComponent(url.slice(1));
	for (let item of replaceList) {
		decodedUrl = decodedUrl.replace(new RegExp(item.to, "g"), item.from);
	}
	for (let item of keyList) {
		decodedUrl = decodedUrl.replace(new RegExp(item.zip, "g"), '"' + item.key + '":');
	}
	let state = JSON.parse(decodedUrl);
	return sanitizeState(state);
};

/**
 * change browser url to new state and reload it
 */
export const setUrlByState = () => {
	const state = getStore().getState();
	window.location.search = encodeURL(state);
};
export const getUrlByState = () => {
	const state = getStore().getState();
	return window.location.href.split('?')[0] + encodeURL(state);
};

/**
 * save last State
 */
export const saveState = (state) => {
	try {
		localStorage.setItem("state", JSON.stringify(state));
	}
	catch (err) {
	}
};
