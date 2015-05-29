/**
 * Created by espen on 28/05/15.
 */

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

function print_artist(arr){
    info = "Album: " + arr.album.name
        + "<br>Release: " + arr.album.releasedate
        + "<br>Artist: " + arr.album.artist
        + "<br>ImageLink: " + arr.album.image[1]['#text'];

    img_url = arr.album.image[2]['#text'];
    info += "<br>img url: " + img_url;
    info += "<br><img src='" + img_url + "' />";

    tracklist = arr.album.tracks.track;
    trackcount = arr.album.tracks.track.length;
    info += "<br>Trackcount: " + trackcount;

    info += "<br>";
    for(i = 0; i < trackcount; i++) {
        info += i+1 + ". " + arr.album.tracks.track[i].name + "<br>";
    }



    document.getElementById("results").innerHTML = info;


}