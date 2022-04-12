// var test = require ('./EstratosBogota.geojson');
var fs = require('fs');


fs.readFile('./EstratosBogota.geojson', (err, data) => {
    const hello = JSON.parse(data);

    hello.features.map(o => {
        if (o.properties.Estrato == null) {
            console.log(o)
        }
    })
})

