function load_artist(){
    var xmlhttp = new XMLHttpRequest();
    var url = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&artist=Cher&album=Believe&format=json";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var myArr = JSON.parse(xmlhttp.responseText);
            print_artist(myArr);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Fetches the JSON data from a web service based on specific request url string.
 * We use synchronous transmission, even though it is not recommended. Our needs are small
 * in temrs of data and we will not experience much waiting.
 * @param request
 */
function fetchDataFromWebService(request){
    var xmlhttp = new XMLHttpRequest();
    var url = request;
    var unparsedJSON = [];
    var parsedJSON = [];

    xmlhttp.onload = function(e) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            unparsedJSON = xmlhttp.responseText;
            parsedJSON = JSON.parse(unparsedJSON);
            localStorage.setItem('JSONdata', JSON.stringify(parsedJSON));
        }else{
            //throw xmlhttp.statusText;
            throw EXCEPTION.NO_CONNECTION;
        }
    }
    xmlhttp.open("GET", url, false);

    xmlhttp.onerror = function(e){
        throw EXCEPTION.NO_CONNECTION;
    }

    xmlhttp.send();
}

/**
 * Fetches top albums for an artists and returns an array with album objects.
 * @param artist
 * @returns {Array}
 */
function getTopAlbums(mbid, artistName){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid="+mbid+"&limit=10&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topAlbums = [];
    var localJSON, albumcount, current_album_cover, current_album, current_album_mbid;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }
    //printAlbums(JSON.parse(localStorage.getItem('JSONdata'))); //for debugging
    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    albumcount = localJSON.topalbums.album.length;

    for (var i = 0; i < albumcount; i++) {
        current_album_cover = localJSON.topalbums.album[i].image[2]['#text'];
        current_album = localJSON.topalbums.album[i].name;
        current_album_mbid = localJSON.topalbums.album[i].mbid;

        topAlbums.push(new Album(current_album_mbid, artistName, current_album, current_album_cover, 0, 0, 0));
    }

    localStorage.removeItem('JSONdata');

    return topAlbums;
}

/**
 * Retrieves current top artists
 * @returns {Array}
 */
function getTopArtists(){
    var request = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topArtists = [];
    var localJSON, albumcount, artist_name, artist_playcount, artist_mbid, artist_img_l;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    artistCount = localJSON.artists.artist.length;

    for(var i = 0; i<artistCount; i++){
        artist_name =  localJSON.artists.artist[i].name;
        artist_playcount = localJSON.artists.artist[i].playcount;
        artist_mbid = localJSON.artists.artist[i].mbid;
        artist_img_l = localJSON.artists.artist[i].image[2]['#text'];

        topArtists.push(new Artist(artist_mbid, artist_name, artist_playcount, 0, artist_img_l, 0, 0, 0, 0, 0, 0));
    }

    localStorage.removeItem('JSONdata');

    return topArtists;
}

/**
 * Retrives music brainz id based on artist name.
 * @param name
 * @returns {*}
 */
function getArtistMBID(name){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist="+name+"&autocorrect=1&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var localJSON, artistMBID;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    artistMBID = localJSON.artist.mbid;
    localStorage.removeItem('JSONdata');

    return artistMBID;
}

/**
 * Based on music brainz id as parameter retrives preview information about an artist.
 * The preview infomration is placed in an artist object with parameters of mbid, small image and name.
 * This function is not used.
 * @param mbid
 * @returns {Artist}
 */
function getArtistPreview(mbid){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid="+mbid+"&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var localJSON, artist_mbid, artist_name, artist_img_m;


    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    artist_mbid = mbid;
    artist_name = localJSON.artist.name;
    artist_img_m = localJSON.artist.image[1]['#text'];

    var artist = new Artist(artist_mbid, artist_name, 0, artist_img_m, 0, 0, 0, 0, 0, 0, 0);

    localStorage.removeItem('JSONdata');

    return artist;
}

/**
 * Fetches similar artist to this artist based on this artists music brainz id.
 * Return an array of simplyfied artists objects with imdb, name and medium sized image.
 * @param mbid
 * @returns {Array}
 */
function getSimilarArtistsPreview(mbid){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&limit=6&mbid="+mbid+"&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";

    var localJSON, artist_mbid, artist_name, artist_img_l, similar_artists=[];

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    for(var i = 0; i < localJSON.similarartists.artist.length; i++){
        artist_mbid = localJSON.similarartists.artist[i].mbid;
        artist_name = localJSON.similarartists.artist[i].name;
        artist_img_l = localJSON.similarartists.artist[i].image[2]['#text'];
        similar_artists.push(new Artist(artist_mbid, artist_name, 0, artist_img_l, 0, 0, 0, 0, 0, 0, 0));
    }

    localStorage.removeItem('JSONdata');

    return similar_artists;
}

/**
 * Retrives info about artist based on musicbrainz id as parameter.
 * Returns an artist object.
 * @param mbid
 * @returns {Artist}
 */
function getArtistInfo(mbid){
    //alert(mbid);
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid="+mbid+"&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var localJSON, artist_mbid, artist_name, artist_playcount, artist_img_m, artist_img_l, artist_img_xl, artist_ontour, artist_tags = [], artist_bio_short, artist_year_formed;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    artist_mbid = mbid;
    artist_name = localJSON.artist.name;
    artist_playcount = localJSON.artist.stats.playcount;
    artist_img_m = localJSON.artist.image[1]['#text'];
    artist_img_l = localJSON.artist.image[2]['#text'];
    artist_img_xl = localJSON.artist.image[3]['#text'];
    artist_ontour = localJSON.artist.ontour;

    //Populating artist similar artist array
    var artist_similar_artists = getSimilarArtistsPreview(mbid);

    //Populating artist genre tags array
    for(var j = 0; j < localJSON.artist.tags.tag.length; j++){
        artist_tags.push(localJSON.artist.tags.tag[j].name);
    }

    artist_bio_short = localJSON.artist.bio.summary;
    artist_year_formed = localJSON.artist.bio.yearformed;

    var artist = new Artist(artist_mbid, artist_name, artist_playcount, artist_img_m, artist_img_l, artist_img_xl, artist_ontour, artist_similar_artists, artist_tags, artist_bio_short, artist_year_formed);

    localStorage.removeItem('JSONdata');

    return artist;
}

function getArtistWiki(name){
    var request = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+name;
    var localJSON, wiki;
}


/**
 * Returns the album with the given Music Brains ID. The album has an array with tracks which is in the last.fm format
 * and not a local track object. Maybe this will be changed later.
 * @param mbid
 * @returns {Album}
 */
function getAlbumInfo(mbid){
    var request = "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&artist="+mbid+"&format=json";
    var localJSON, album_mbid, album_artist, album_title, album_tracks = [], album_cover_l, album_label, album_year;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    album_mbid = mbid;
    album_artist = localJSON.artist;
    album_title = localJSON.name;
    album_cover_l = localJSON.image[3]['#text'];

    for(var i = 0; i < localJSON.tracks.length; i++){
        album_tracks.push(localJSON.tracks.track[i]);
    }
    album_year = localJSON.releasedate;

    var album = new Album(mbid, album_artist, album_title, album_cover_l, album_tracks, 0, album_year);
    localStorage.removeItem("JSONdata");

    return album;

}




/**
 * For debugging
 * @param arr
 */
function printAlbums(arr) {

    if(arr.error > 1){
        document.write(arr.message);
    }else {
        //document.write(arr.length);

        albumcount = arr.topalbums.album.length;
        document.write("<br><u>printAlbums()</u><br><b>Total albums found: " + albumcount + "</b><br>");

        //Skriver rut listen over alle album
        for (i = 0; i < albumcount; i++) {
            current_album_cover = arr.topalbums.album[i].image[2]['#text'];
            current_album = arr.topalbums.album[i].name;

            document.write("<br><img src='" + current_album_cover + "' />");
            document.write(current_album);
        }
    }
}


function getSearchResults(text) {
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=10&&artist=" + text + "&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var localJSON, result = [], artist_mbid, artist_name, artist_img_m;

    try {
        fetchDataFromWebService(request);
    } catch (e) {
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    var resArr = localJSON.results.artistmatches.artist;

    if (resArr.length > 0) {
        for (var i = 0; i < resArr.length; i++) {
            artist_mbid = resArr[i].mbid;
            artist_name = resArr[i].name;
            artist_img_m = resArr[i].image[0]['#text'];
            var artist = new Artist(artist_mbid, artist_name, 0, artist_img_m, 0, 0, 0, 0, 0, 0, 0);
            result.push(artist);
        }

        localStorage.removeItem('JSONdata');

    }
    return result;
}




/**
 * Just a simple set of rules to parse wikipedia style text escaped with single or double \n
 * @param text
 * @returns {XML|string|*}
 */
function wikiParser(text){
    var lineSkiftPattern = /\n/g;
    var doubleLineSkiftPattern = /(\n)\1/g;

    text = text.replace(doubleLineSkiftPattern, "<br><br>");
    text = text.replace(lineSkiftPattern, "</p><p>");
/*
    var result = text.split(doubleLineSkiftPattern);
    var temp;

    for(var i = 0; i < result.length; i++){
        if(result[i].length < 90){
            temp += "<h3>" + result[i] + "</h3>";
        }else{
            temp += result[i];
        }

    }
*/
    return text;
}

function urlEncodeText(text){
    return encodeURIComponent(text);
}