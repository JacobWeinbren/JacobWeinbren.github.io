map = L.map('mapid', {
    zoomSnap: 0.2,

}).setView([54, -2], 6);

$.ajax({
    url: "results.csv",
    async: false,
    success: function(data) {
        results = $.csv.toArrays(data);
    }
});

parties = {
    "C": "Conservative",
    "DUP": "Democratic Unionist Party",
    "Green": "Green Party",
    "Ind": "Independent",
    "Lab": "Labour",
    "LD": "Liberal Democrats",
    "PC": "Plaid Cymru",
    "SF": "Sinn Fein",
    "SNP": "SNP"
}

colours = {
    "C": "#0087DC",
    "DUP": "#D46A4C",
    "Green": "#6AB023",
    "Ind": "darkgrey",
    "Lab": "#DC241f",
    "LD": "#FAA61A",
    "PC": "#008142",
    "SF": "#326760",
    "SNP": "#FEF987",
    "Brex": "#12B6CF",
    "CHUK": "#ffffff"
}

seats = {
    "C": 318,
    "Lab": 262,
    "SNP": 35,
    "LD": 12,
    "DUP": 10,
    "SF": 7,
    "PC": 4,
    "Green": 1,
    "Ind": 2
}

for (colour in colours) {
    $("#" + colour).css('background-color', colours[colour])
    $("#c-" + colour).css('background-color', colours[colour])
}

function gains() {
    constituencies.eachLayer(function(layer) {
        layer.setStyle({
            fillOpacity: 0.1,
            opacity: 0.1
        });
        for (i = 0; i < results.length; i++) {
            if (layer.constituency == results[i][0]) {
                if (layer.party != results[i][1]) {
                    layer.setStyle({
                        fillOpacity: 1,
                        opacity: 1
                    });
                }
            }
        }
    });
}

function regular() {
    constituencies.eachLayer(function(layer) {
        layer.setStyle({
            fillOpacity: 1,
            opacity: 1
        });
    });
}



function getResult(constituency) {
    for (i = 0; i < results.length; i++) {
        if (results[i][0] == constituency) {
            party = results[i][1]
            return party
        }
    }
}

$('#draw div').click(function(event) {
    mode = 'draw';
    party_id = event.target.id.split('-')[1]
    $('#mode').html('Mode: <font color="' + colours[party_id] + '">Draw</font>')
});

shp("westminster.zip").then(function(geojson) {
    console.log(geojson)
    constituencies = L.geoJSON(geojson, {
        onEachFeature: function(feature, layer) {
            constituency = feature.properties.pcon17nm
            layer.party = getResult(constituency)
            layer.constituency = constituency
            layer.setStyle({
                fillColor: colours[getResult(constituency)]

            });

            layer.on('mouseover', function() {
                constituency = feature.properties.pcon17nm
                party_name = parties[getResult(constituency)]
                $('#name').html("<font color='" + colours[getResult(constituency)] + "'>" + party_name + "</font><br>" + constituency)
            });

            layer.on('click', function() {
                if (mode == 'draw') {
                    layer.setStyle({
                        fillColor: colours[party_id]
                    });
                    seats[layer.party] -= 1
                    for (seat in seats) {
                        $('#' + seat).text(seats[seat])
                    }
                    layer.party = party_id
                    feature.properties
                    seats[party_id] += 1
                }
            });
        },
        weight: 0.3,
        color: '#000000',
        fillOpacity: 1,
        smoothFactor: 0.9
    }).addTo(map);
});