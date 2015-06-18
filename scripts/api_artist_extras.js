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
 * @TODO: Det inntreffer at artsister mangler i echonest (prøv Florence + the machine i test_11.html). Hvis det skjer kommer ut en alert i konsol. Det bør vi catche og bruke den korte bio versjonen som vi alerede har.
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

        return new Biography(biography, site, url, license_type, license_attribution);
    }
}