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
 * Fetches the JSON data from last.fm service based on specific request url string
 * @param request
 */
function fetchDataLastFM(request){
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
            throw xmlhttp.statusText;
        }
    }
    xmlhttp.open("GET", url, true);

    xmlhttp.onerror = function(e){
        throw "Connection error";
    }

    xmlhttp.send();
}


/**
 * An album object (container) for storing album data.
 * @param artist
 * @param title
 * @param tracks
 * @param label
 * @param year
 * @constructor
 */
function Album(mbid, artist, title, cover_l,tracks, label, year){
    this.mbid = mbid; //album id for musicbrainz.org
    this.artist = artist
    this.title = title
    this.tracks = tracks
    this.cover_l = cover_l
    this.label = label
    this.year = year

    //For debugging purposes, Prints contents into debugging console
    this.toConsole = function(){
        var output = "Artist : "+artist+"\nAlbum : "+title+" mbid: "+mbid;
        console.log(output);
    }

    //For debugging purposes, Prints contents straight to document
    this.toDocument = function(){
        var output = "<br>Artist : "+artist+"\nAlbum : "+title+" mbid: "+mbid;
        document.write(output);
    }
}

/**
 * Artist object (container)
 * @param name
 * @param playcount
 * @param image_m
 * @constructor
 */
function Artist(mbid, name, playcount, image_l, image_xl, ontour, similar_artists, tags, bio, year_formed){
    this.mbid = mbid; // artist id for musicbrainz.org
    this.name = name
    this.playcount = playcount
    this.image_l = image_l
    this.image_xl = image_xl
    this.ontour = ontour
    this.similar_artists = similar_artists //array with similar artists
    this.tags = tags //array with tags
    this.bio = bio
    this.year_formed = year_formed

    //For debugging
    this.toConsole = function() {
        var output = "Artist: " + name + " mbid: "+mbid;
        console.log(output);
    }

    //For debugging
    this.toDocument = function() {
        var output = "<br><img src="+image_l+" />" + name + "Playcount: "+playcount + " mbid: "+mbid;
        document.write(output);
    }

    //For debugging
    this.toDocumentAll = function() {
        var output = "<br><h1>"+name+"</h1>"
        output+= "<br><img src="+image_xl+" />";
        output+= "<img src="+image_l+" />";
        output += "<br><br>mbid: "+mbid+"<br>Playcount: "+playcount+"<br>OnTour: "+ontour;
        output += "<br>Tags: <i>TODO</i> <br> Similar artists: <i>TODO</i>"
        output += "<br><br><u>Bio</u><br>"+bio;
        output += "<br>Year formed: "+year_formed;
        document.write(output);
    }

}

/**
 * Fetches top albums for an artists and returns an array with album objects.
 * @param artist
 * @returns {Array}
 */
function getTopAlbums(artist){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist="+artist+"&limit=10&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var topAlbums = [];
    var localJSON, albumcount, current_album_cover, current_album, current_album_mbid;

    try {
        fetchDataLastFM(request);
    }catch (e){
        alert(e);
    }
    //printAlbums(JSON.parse(localStorage.getItem('JSONdata'))); //for debugging
    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    albumcount = localJSON.topalbums.album.length;

    for (var i = 0; i < albumcount; i++) {
        current_album_cover = localJSON.topalbums.album[i].image[2]['#text'];
        current_album = localJSON.topalbums.album[i].name;
        current_album_mbid = localJSON.topalbums.album[i].mbid;

        topAlbums.push(new Album(current_album_mbid, artist, current_album, current_album_cover, 0, 0, 0));
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
        fetchDataLastFM(request);
    }catch (e){
        alert(e);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    artistCount = localJSON.artists.artist.length;

    for(var i = 0; i<artistCount; i++){
        artist_name =  localJSON.artists.artist[i].name;
        artist_playcount = localJSON.artists.artist[i].playcount;
        artist_mbid = localJSON.artists.artist[i].mbid;
        artist_img_l = localJSON.artists.artist[i].image[2]['#text'];

        topArtists.push(new Artist(artist_mbid, artist_name, artist_playcount, artist_img_l));
    }

    localStorage.removeItem('JSONdata');

    return topArtists;
}

function getArtistInfo(mbid){
    var request = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid="+mbid+"&api_key=8bcfaa2a2c9ca4831ff364afc6b2e2f0&format=json";
    var localJSON, artist_mbid, artist_name, artist_playcount, artist_img_l, artist_img_xl, artist_ontour, artist_similar_artists = [], artist_tags = [], artist_bio, artist_year_formed;

    try {
        fetchDataLastFM(request);
    }catch (e){
        alert(e);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    artist_mbid = mbid;
    artist_name = localJSON.artist.name;
    artist_playcount = localJSON.artist.stats.playcount;
    artist_img_l = localJSON.artist.image[2]['#text'];
    artist_img_xl = localJSON.artist.image[3]['#text'];
    artist_ontour = localJSON.artist.ontour;
    //todo: legg til forløkke som setter artist_similar:artists og artsist_tags
    artist_bio = localJSON.artist.bio.summary;
    artist_year_formed = localJSON.artist.bio.yearformed;

    var artist = new Artist(artist_mbid, artist_name, artist_playcount, artist_img_l, artist_img_xl, artist_ontour, 0, 0, artist_bio, artist_year_formed);

    localStorage.removeItem('JSONdata');

    return artist;



}


/**
 * For debugging
 */
function hei(){
    document.write("hei");
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
