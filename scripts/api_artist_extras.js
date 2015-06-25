/**
 * ***************************************************************************************
 * api_artist_extras.js
 * Here are extra functions to individually retrieve additional information about artist.
 * ***************************************************************************************
 */

var localJSON, responseCode;

/**
 * Performs a request to the Echonest service for alle extended artist functions here.
 * @param request
 */
function fetchDataByMethod(request){
    try {
        fetchDataFromWebService(request);
    } catch (e) {
        alert("Error id: " + e.id + "\nMessage: " + e.description);
    }
    localJSON = JSON.parse(localStorage.getItem('JSONdata'));
    responseCode = localJSON.response.status.code;
}

/**
 * Retrives full artist biography based on mbid or artist name (depends on which one is available).
 * @param mbid
 * @param name
 * @returns {Biography}
 */
function getFullArtistBiography(mbid, name) {
    var urlName = urlEncodeText(name);

    //Change source according to prefered biography information source
    var source = "wikipedia";
    //var source = "Last.fm";

    //Using cc-by-sa license to narrow search only to last.fm and wikipedia results
    var mbidRequest = "http://developer.echonest.com/api/v4/artist/biographies?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:" + mbid + "&format=json&license=cc-by-sa";
    var nameRequest = "http://developer.echonest.com/api/v4/artist/biographies?api_key=IGXFHMSAKGWFM7VA0&name="+ name +"&format=json&license=cc-by-sa";

    var i = 0, biography, site, url, license_type, license_attribution;

    //Performing first request based on mbid
    fetchDataByMethod(mbidRequest);

    if(responseCode > 0){
        //If status code is 5 the artist mbid lookup is not available at echonest service. Request is rerun to search by artist name.
        fetchDataByMethod(nameRequest);

        if(responseCode > 0) {
            //No artist foud by mbid or name. Catch this exception and revert to Last.fm short biography
            throw EXCEPTION.NO_ARTIST;
        }
    }

    if(responseCode == 0){
        //Looking for the Last.fm bio (shortest)
        while (localJSON.response.biographies[i].license.attribution != source) { //change to "wikipedia" or "Last.fm"
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
 * Fetches 10 picters of an artist based on mbid or artist name if mbid is not available
 * at Echonest service.
 * @param mbid
 * @param name
 * @returns {Array}
 */
function getArtistImages(mbid, name){
    var mbidRequest = "http://developer.echonest.com/api/v4/artist/images?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:"+mbid+"&format=json&license=cc-by-sa&results=10";
    var nameRequest = "http://developer.echonest.com/api/v4/artist/images?api_key=IGXFHMSAKGWFM7VA0&name="+ name +"&format=json&license=cc-by-sa&results=10";

    var artist_images = [], url, width, height, aspect_ratio, license_type, license_attribution, owner_url;

    //Performing first request based on mbid
    fetchDataByMethod(mbidRequest);

    if(responseCode > 0){
        //If status code is 5 the artist mbid lookup is not available at echonest service. Request is rerun to search by artist name.
        fetchDataByMethod(nameRequest);

        if(responseCode > 0) {
            //No artist foud by mbid or name. Catch this exception and revert to Last.fm short biography
            throw EXCEPTION.NO_ARTIST;
        }
    }

    if(responseCode ==0) {
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
function getArtistNews(mbid, name){
    var mbidRequest = "http://developer.echonest.com/api/v4/artist/news?api_key=IGXFHMSAKGWFM7VA0&id=musicbrainz:artist:"+mbid+"&format=json&high_relevance=true";
    var nameRequest = "http://developer.echonest.com/api/v4/artist/news?api_key=IGXFHMSAKGWFM7VA0&name="+ name +"&format=json&high_relevance=true";

    var artist_news =  [], source, date, topic, summary;

    //Performing first request based on mbid
    fetchDataByMethod(mbidRequest);

    if(responseCode > 0){
        //If status code is 5 the artist mbid lookup is not available at echonest service. Request is rerun to search by artist name.
        fetchDataByMethod(nameRequest);

        if(responseCode > 0) {
            //No artist foud by mbid or name. Catch this exception and revert to Last.fm short biography
            throw EXCEPTION.NO_ARTIST;
        }
    }

    if (responseCode == 0) {
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

