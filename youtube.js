var getType = function(url){
	console.dir('type='+url.split('type=')[1].split('&')[0].split(',')[0].split(';')[0]);
	return 'type='+url.split('type=')[1].split('&')[0].split(',')[0].split(';')[0];
}

var getQuality = function(url){
	console.dir('quality='+url.split('quality=')[1].split('&')[0].split(',')[0].split(';')[0]);
	return 'quality='+url.split('quality=')[1].split('&')[0].split(',')[0].split(';')[0];
}

t='';
q='';
var set_t = function(t){
	t=t.split('/')[1].toUpperCase();
	console.log(t);
	
	if(t.indexOf('-') != -1){
		t=t.split('-')[1];
	}
	return t;
}

var set_q = function(q){
	q=q.split('quality=')[1];
	if(q=='hd1080'){
		q='1080p';
	}

	else if(q=='hd720'){
		q='720p';
	}

	else if(q=='large'){
		q='480p';
	}

	else if(q=='medium'){
		q='360p';
	}

	else if(q=='small' ){
		q='240p';
	}
	console.log(q);
	return q;

}
var validURL = function(url){
	t = getType(url);
	q = getQuality(url);
	if((t == 'type=video/mp4' && q == 'quality=hd1080') || (t == 'type=video/mp4' && q == 'quality=hd720') || (t == 'type=video/mp4' && q == 'quality=medium') || (t == 'type=video/x-flv' && q == 'quality=large') || (t == 'type=video/x-flv' && q == 'quality=medium') || (t == 'type=video/x-flv' && q == 'quality=small') /*|| (t == 'type=video/3gpp' && q == 'quality=small')*/){
		console.log('TRUE');
		t=set_t(t);
		q=set_q(q);
		return true;
	}
	return false;
}
$(function(){
	var movie_player = document.getElementById('movie_player');
	var flashvars = movie_player.getAttribute('flashvars');
	var decoded_flashvars = decodeURIComponent(decodeURIComponent(decodeURIComponent(flashvars)));
	var url_encoded_fmt_stream_map = decoded_flashvars.split('url_encoded_fmt_stream_map=')[1];
	var url_split = url_encoded_fmt_stream_map.split('url=');
	//console.dir('url_split : ' + url_split);
	//console.dir('url_split.length : ' + url_split.length);
	var initial_contents = url_split[0];
	console.dir(initial_contents);
	for(var i=1;i<url_split.length-1;i++){
		if(initial_contents!=''){
			console.dir(initial_contents);
			var initial_contents_params = (initial_contents + '&').split(/=.*?&/);
			//console.dir(initial_contents_params);

			console.dir('original : '+url_split[i]);

			var index = url_split[i].lastIndexOf(initial_contents_params[0]);
			var arr=[];
			arr[0] = url_split[i].substr(0,index);
			arr[1]=url_split[i].substr(index);
			console.dir('arr[0]' + arr[0]);
			console.dir('arr[1]' + arr[1]);
			var prev = initial_contents.split(/itag=.*?&/)[0];
			console.dir('prev : ' + prev);
			var next = initial_contents.split(/itag=.*?&/)[1];
			console.dir('next : ' + next);
			var finalURL = arr[0].split(/,*$/)[0] + '&'; /* + initial_contents.split(/itag=.*?&/)[0]+initial_contents.split(/itag=.*?&/)[1];*/
			console.dir('finalURL 1 : ' + finalURL);
			if(prev!=undefined){
				finalURL+=prev;
				console.dir('finalURL 2 : ' + finalURL);
			}
			if(next!=undefined){
				finalURL+=next;
				console.dir('finalURL 3 : ' + finalURL);
			}
			if(finalURL.split('itag=').length>2){
				finalURL = finalURL.split('itag=')[0]+'itag='+finalURL.split('itag=')[1]+finalURL.split('itag=')[2].split(/^[0-9]*/)[1];
				console.dir('finalURL 4 : ' + finalURL);
				finalURL = finalURL.split('sig')[0]+'signature'+finalURL.split('sig')[1];
				console.dir('finalURL (inside) : ' + finalURL);
				console.dir('initial_contents : '+initial_contents)
			}
			else{
				finalURL = finalURL.split('sig')[0]+'signature'+finalURL.split('sig')[1];	
				console.dir('initial_contents : '+initial_contents)
			}
			
			if(validURL(finalURL) == true){
				finalURL.split(/,*$/);
				console.dir('finalURL (added): ' + finalURL);
				text='<a class=" yt-uix-button yt-uix-button-text yt-uix-tooltip yt-uix-button-empty" href = ' + finalURL + '&' + 'title=\"'+encodeURIComponent($('title').text()) +'" ><span class="yt-uix-button-valign"></span><span class="yt-uix-button-content">'+t+'/'+q+'</span> </a>'
				$('#watch-like-dislike-buttons').append(text);
			}
			else{
				console.dir('valid url was false');
			}
			initial_contents=arr[1];
		}
		else{
			console.log('Its normal');
			finalURL=url_split[i];
						if(finalURL.split('itag=').length>2){
				finalURL = finalURL.split('itag=')[0]+'itag='+finalURL.split('itag=')[1]+finalURL.split('itag=')[2].split(/^[0-9]*/)[1];
				console.dir('finalURL 4 : ' + finalURL);
				finalURL = finalURL.split('sig')[0]+'signature'+finalURL.split('sig')[1];
				console.dir('finalURL (inside) : ' + finalURL);
				console.dir('initial_contents : '+initial_contents)
			}
			else{
				finalURL = finalURL.split('sig')[0]+'signature'+finalURL.split('sig')[1];
				console.dir('initial_contents : '+initial_contents)
			}
			if(validURL(finalURL) == true){
				finalURL.split(/,*$/);
				console.dir('finalURL (added): ' + finalURL);
				text='<a class=" yt-uix-button yt-uix-button-text yt-uix-tooltip yt-uix-button-empty" href = ' + finalURL + '&' + 'title=\"'+encodeURIComponent($('title').text()) +'" ><span class="yt-uix-button-valign"></span><span class="yt-uix-button-content">'+t+'/'+q+'</span> </a>'
				$('#watch-like-dislike-buttons').append(text);
			}
		}
	}

});