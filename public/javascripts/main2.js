$(document).ready(function(){

    //Global Variables
    var xPos;
    var yPos;
    var map;
    var markers = {};
    var businesses;
    var divs = {};

    google.maps.event.addDomListener(window, 'load', initialize);

    //Initialize google map
    function initialize() {
        //Set map options
        var mapOptions = {
            center: { lat: 45.3914, lng: -75.659 },
            streetViewControl: false,
            //disableDefaultUI:true,
            minZoom:11,
            maxZoom:16,
            zoom: 13,
        };
        //Snazzy Maps Styling
        var styles = [{"featureType":"all","elementType":"geometry","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#f9fcff"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#ffffff"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"lightness":16},{"weight":"0.28"},{"color":"#000000"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#a9b3ba"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#101f2d"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"transit.station","elementType":"geometry.fill","stylers":[{"color":"#51626f"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#51626f"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#67a2b9"}]}];
        //Create map object
        map = new google.maps.Map(document.getElementById('mapContainer'),mapOptions);
        map.setOptions({styles: styles});       
    }

    var dataReceived;
    var doGet = function(callback) {
        //Get request to obtain businesses. Create a panel for each business
        $.get( '/main', function( data ) {
            console.log(data['businesses']);
            businesses = data['businesses'];
            for(var x = 0 ; x < businesses.length ; x++) {
                var $div = $("<div class='panel btn btn-primary btn-lg active'><img src='" + businesses[x]['image_url'] + "' class='anImage img-circle'></img></div>");
                $('#sidePanel').append($div);
                $div.attr('id', x);
                var $name = $("<h4 class='customTitle'>" + businesses[x].name + "</h4>");
                $div.append($name);
                $name.attr('id', 'name' + x);
                console.log(businesses[x].categories);
                var $phoneNumber = $("<p class='customTitle'>" + businesses[x].phone + "</p>");
                $div.append($phoneNumber);
                var $address = $("<p class='customTitle'>" + businesses[x].location['address'][0]+ "</p>")
                $div.append($address);
                $address.attr('id', 'address' + x);
                var categories = "Categories: ";
                for(var y = 0; y < businesses[x].categories.length; y++) {
                    categories+= businesses[x].categories[y][0];
                    if(!(y === ((businesses[x].categories.length)-1))) {
                        categories+= " , ";
                    }                   
                }
                var $categories = $("<p class='customTitleLeft'>" + categories + "</p>");
                $div.append($categories);
                $ratings = $("<div><img src='" + businesses[x]['rating_img_url_small'] + "' class='anImage img-thumbnail'></img></div>");
                $div.append($ratings);
                divs[businesses[x].name] = $div;
            }
        }).done(function(data){
            dataReceived = data;
            //For each business, create a marker for it and plot it
            for(var x = 0 ; x < businesses.length ; x++) {
                var lat = businesses[x].location['coordinate']['latitude'];
                var lon = businesses[x].location['coordinate']['longitude'];
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lon),
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: businesses[x].name
                });
                marker.info = new google.maps.InfoWindow({
                    content: businesses[x].name
                });
                //On hover, scroll the side panel to the corresponding panel and make it glow
                google.maps.event.addListener(marker, 'mouseover', function() {
                    this.info.open(map, this);
                    divs[this.title].toggleClass('glow');
                    $('#sidePanel').animate({scrollTop: divs[this.title].offset().top},'slow');
                });
                google.maps.event.addListener(marker, 'mouseout', function() {
                    this.info.close(map, this);
                    divs[this.title].toggleClass('glow');
                });        
            }
            xPos = data['lat'];
            yPos = data['lon'];
            if(xPos === undefined || yPos === undefined) {
                xPos = 45.24;
                yPos = -75.73;
            }
            myLatlng = new google.maps.LatLng(xPos, yPos);
            var infowindow = new google.maps.InfoWindow({
                content: "My Position"
            });
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                animation: google.maps.Animation.DROP,
                title: "My Position"
            });
            markers['myLocation'] = marker;
            console.log("marker created");
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });
            callback();
        });
    }
	doGet(function(){
        console.log("All is done");
    });
});