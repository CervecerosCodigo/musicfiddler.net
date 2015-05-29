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
