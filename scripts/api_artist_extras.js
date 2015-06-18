/**
 * ***************************************************************************************
 * api_artist_extras.js
 * Here are extra functions to individually retrieve additional information about artist.
 * ***************************************************************************************
 */

/**
 * Retrieves artist biography (wiki) as presented at Last.fm artist page.
 * Function can be easly modified to retrieve data from the wikipedia instead.
 * @param mbid
 * @returns {Biography}
 * @TODO: Husk å fange opp exception for NO_ARTIST som blir kastet dersom artisten ikke finnes.
 */
function getFullArtistBiography(mbid){
    //Using cc-by-sa license to narrow search only to last.fm and wikipedia results
    var request = "http://developer.echonest.com/api/v4/artist/biographies?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:"+mbid+"&format=json&license=cc-by-sa";

    var localJSON, i = 0, biography, site, url, license_type, license_attribution;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    if(localJSON.response.status.code > 0){
        throw EXCEPTION.NO_ARTIST;
    }else {
        //Looking for the Last.fm bio (shortest)
        while (localJSON.response.biographies[i].license.attribution != "wikipedia") { //change to "wikipedia" or "Last.fm"
            i++;
        }

        biography = localJSON.response.biographies[i].text;
        site = localJSON.response.biographies[i].site;
        url = localJSON.response.biographies[i].url;
        license_type = localJSON.response.biographies[i].license.type;
        license_attribution = localJSON.response.biographies[i].license.attribution;

        localStorage.removeItem('JSONdata');

        //Parsing th e biography string
        biography = wikiParser(biography);

        return new Biography(biography, site, url, license_type, license_attribution);
    }
}

/**
 * Fetches 10 artist images based on music brainz id for an artist.
 * Return an array of Image() objects.
 * @param mbid
 * @returns {Array}
 */
function getArtistImages(mbid){
    var request = "http://developer.echonest.com/api/v4/artist/images?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:"+mbid+"&format=json&license=cc-by-sa&results=10";

    var localJSON, artist_images = [], url, width, height, aspect_ratio, license_type, license_attribution, owner_url;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    if(localJSON.response.status.code > 0){
        throw EXCEPTION.NO_ARTIST;
    }else {
        for(var i = 0; i < localJSON.response.images.length; i++){
            url = localJSON.response.images[i].url;
            width = localJSON.response.images[i].width;
            height = localJSON.response.images[i].height;
            aspect_ratio = localJSON.response.images[i].aspect_ratio;
            license_type = localJSON.response.images[i].license.type;
            license_attribution = localJSON.response.images[i].license.attribution;
            owner_url = localJSON.response.images[i].license.url;
            artist_images.push(new Image(url, width, height, aspect_ratio, license_type, license_attribution, owner_url));
        }
    }

    localStorage.removeItem('JSONdata');

    return artist_images;
}

/**
 * Fetches latest news about an artist based on music brainz id.
 * Only news with high relevance about artist are collected.
 * @param mbid
 * @returns {Array}
 */
function getArtistNews(mbid){
    var request = "http://developer.echonest.com/api/v4/artist/news?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:"+mbid+"&format=json&high_relevance=true";

    var localJSON, artist_news =  [], source, date, topic, summary;

    try {
        fetchDataFromWebService(request);
    }catch (e){
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }

    localJSON = JSON.parse(localStorage.getItem('JSONdata'));

    if(localJSON.response.status.code > 0){
        throw EXCEPTION.NO_ARTIST;
    }else {
        for(var i = 0; i < localJSON.response.news.length; i++) {
            source = localJSON.response.news[i].url;
            date = localJSON.response.news[i].date_found;
            topic = localJSON.response.news[i].name;
            summary = localJSON.response.news[i].summary;
            artist_news.push(new News(source, date, topic, summary));
        }
    }

    localStorage.removeItem('JSONdata');

    return artist_news;
}