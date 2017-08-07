/*WIKIPHILOSOPHY Util
takes a title, returns in order array of page titles hit on path to Philosophy*/
const request = require('request');
const cheerio = require('cheerio');
const host = 'en.wikipedia.org';
const err  = 'WikiPhilosophy Error: ';
	
/*Fires Recursively
terminates on: loop found, philosophy found, page has no links, page does not exist*/	
function getPhilosophyPath(title, path){
	if(!path){
		path = [];
	}
	return new Promise( (resolve, reject) => {
		path.push(title);
		getPage(title)
		.then( page => {
			//failed due to page !exists
			if(!page){
				return resolve(false);
			}
			var link = getFirstLink(page)
			// failed to find valid link
			if(!link){
				resolve(false);
			} else {
				resolve(link);
			}

		}, getPageErr => {
			reject(getPageErr);
		});
	}).then( link => {
		if(!link){ // !page or page has no links
			return path;
		} else if(path.indexOf(link) > -1){ //encountered a loop
			path.push(link);
			return path;
		}else if (link.toLowerCase() === 'philosophy'){ //succeeded in finding path
			path.push(link);
			return path;
		} else { //continue recursion
			return getPhilosophyPath(link, path);
		}
	}, err => {
		return err;
	});
}

//take in title and return html for wikipedia page
function getPage(title){
	//add underscores to make page titles valid url
	if(title.indexOf(' ') > -1){
		title = title.split(' ').join('_');
	}
	return new Promise( (resolve,reject) => {
		request('https://en.wikipedia.org/wiki/' + title, (err, res, body) => {
			if(err){
				return reject(err);
			} else {
				return resolve(body);
			}
		});
	});
}

//take in html page and return first valid link
function getFirstLink(page){
	var $ = cheerio.load(page);
	var context = $('.mw-parser-output > p').html();
	var anchors = $('.mw-parser-output > p a');
	for(var i = 0; i < anchors.length; i++){
		if(anchors[i].parent.name !== 'sup' && //reference links
			 anchors[i].parent.name !== 'i'){			//italicized links
			if(testParanthesis(anchors[i], context)){
				return anchors[i].attribs.title;
			}
		}
	}
	return false;
}

//test paranthesis balanced by time anchor encountered, 
//true = balanced/valid, false = unbalanced/invalid
function testParanthesis(anchor, context){
	context = context.slice(0, context.indexOf(anchor.attribs.href));
	let stack = []; 
	for(var i = 0; i < context.length; i++){
		if(context[i] === '('){
			stack.push(i);
		}else if(context[i] === ')'){
			stack.pop();
		}
	}
	return stack.length > 0 ? false : true;
}

module.exports = getPhilosophyPath;
