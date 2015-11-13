/**
 * An object to throw if any error occurs internally or externally.
 * @param id
 * @param description
 * @constructor
 */
function Error(id, description){
    this.id = id
    this.description = description
}

/**
 * "Enum" type for different error types.
 * @type {{NO_CONNECTION: Error, NO_ARTIST: Error, NO_ALBUM: Error}}
 */
EXCEPTION = {
    NO_CONNECTION : new Error(0, "Cannot establish a connection."),
    NO_ARTIST : new Error(1, "Artist not found."),
    NO_ALBUM : new Error(2, "Album not found.")
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
function Artist(mbid, name, playcount, image_m, image_l, image_xl, ontour, similar_artists, tags, bio, year_formed){
    this.mbid = mbid; // artist id for musicbrainz.org
    this.name = name
    this.playcount = playcount
    this.image_m = image_m
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
        var output = "<br><h1>"+name+"</h1>";
        output+= "<br><img src="+image_xl+" />";
        output+= "<img src="+image_l+" />";
        output+= "<img src="+image_m+" />";
        output += "<br><br>mbid: "+mbid+"<br>Playcount: "+playcount+"<br>OnTour: "+ontour;
        output += "<br>Tags: ";
        for(var i = 0; i < tags.length; i++)
            output += tags[i] + " | ";
        output += "<br> Similar artists: <i>Kan ikke skrives ut direkte fra objektet ettersom det vil årsake uendelig loop. Kjør test_10.html for å teste</i>";
        output += "<br><br><u>Bio</u><br>"+bio;
        output += "<br><br>Year formed: "+year_formed;

        document.write(output);
    }

    this.toDocumentPreview = function() {
        var output = "<br><h1>"+name+"</h1>";
        output += "<br><img src="+image_m+" />";
        output += "<br><br>mbid: "+mbid;
        document.write(output);
    }

}

/**
 * Biography object.
 * @param biography
 * @param site
 * @param url
 * @param license_type
 * @param license_attribution
 * @constructor
 */
function Biography(biography, site, url, license_type, license_attribution){
    this.biography = biography
    this.site = site
    this.url = url
    this.license_type = license_type
    this.license_attribution = license_attribution
}

/**
 * Image object.
 * @param url
 * @param width
 * @param height
 * @param aspect_ratio
 * @param license_type
 * @param license_attribution
 * @param owner_url
 * @constructor
 */
function Image(url, width, height, aspect_ratio, license_type, license_attribution, owner_url){
    this.url = url
    this.width = width
    this.height = height
    this.aspect_ratio = aspect_ratio
    this.license_type = license_type
    this.license_attribution = license_attribution
    this.owner_url = owner_url
}

/**
 * News object.
 * Used for collection latest artists news.
 * @param source
 * @param date
 * @param topic
 * @param summary
 * @constructor
 */
function News(source, date, topic, summary){
    this.source = source
    this.date = date
    this.topic = topic
    this.summary = summary
}
