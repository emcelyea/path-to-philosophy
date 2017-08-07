
var WikiPhilosophy = function(){};

WikiPhilosophy.prototype = {
	
	//HTTP request to get path from title -> philosophy
	//returns a promise that will resolve with the path, path is also bound to instance of WikiPhilosophy 
	getPath:function(title){
		if(title){
			this.title = title;
		}	
		//would normally use babel and arrow functions but doing this fast
		var that = this;
		return new Promise(function(resolve, reject){
			if(that.title){
				var req = new XMLHttpRequest();
				req.open('GET', '/wiki-philosophy?title=' + that.title);
				req.onreadystatechange = function(){
					if(req.readyState === XMLHttpRequest.DONE){
						if(req.status === 200){
							that.path = JSON.parse(req.responseText);
							resolve(that.path);
						} else {
							reject(req.responseText);
						}
					}
				}
				req.send();
			} else {
				reject('title invalid');
			}
		});
	},
	drawPath:function(element){
		element.innerHTML = this.path.join('=>');
	}
}


