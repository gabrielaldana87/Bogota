import * as d3 from 'd3';
import * as topojson from 'topojson';

const
    projection = d3.geoMercator()
        .center([-74.060042, 4.659853])
        .scale(1000000),
    // .scale(2500000) //SCALE FOR GRANADA
    // .translate([(width) / 2, (height)/2]),
    path = d3.geoPath().projection(projection),
    myColor = d3.scaleSequential().domain([1,6])
        .interpolator(d3.interpolateViridis),
    zoomTo = (location, scale) => {
        let [[x0, y0], [x1, y1]] = path.bounds(location)
        // const [[x0, y0], [x1, y1]] = [[600,200],[1200, 1200]];
        return d3.zoomIdentity
            .translate(-(x0 + x1 - 100), -(y0 + y1 - 100) / 2 )
            // .translate(width / 2, height / 2)
            // .translate([width / 2 - point[0] * scale, height / 2 - point [1] * scale ])
            .scale(scale);
    },
    positionSectorName = (d,i,t, sectorName) => {
        const
            text = d3.select(t[i]),
            a = text.node().getComputedTextLength(),
            b = text.node().getSubStringLength(0, sectorName.indexOf(' ')),
            x0 = d.bounds ? d.bounds[0][0] : path.bounds(d)[0][0],
            x1 = d.bounds ? d.bounds[1][0] : path.bounds(d)[1][0]
        ;
        if (a > x1 - x0 ) {
            const split = sectorName.split(/\s/g);
            const tspan = d3.select(t[i]).text(null);
            tspan.selectAll('.tspan')
                .data(split)
                .enter()
                .append('tspan')
                .text(d => d )
                .attr('y', (d,i) => i * 10)
                .attr('x', (d,i) =>  (x1 - x0) - (a / 2))
            ;
        }
    }
;

export const drawBogota = props => {
    const chart = selection => {
        if (props.hasOwnProperty('estratos') && props.hasOwnProperty('sector') && props.listings.length > 0) {
            var
                scale,
                width = props.width,
                height = props.height,
                translate = ([(width) / 2, (height)/2])
            ;
            const
                { points, estratos, neighborhood, listings } = props,
                bogotaPoint = [-74.060042, 4.659853],
                pointsReduce = points.reduce((a,b) => {
                    a[b.sector] = a[b.sector] + 1 | 1 ;
                    return a;
                },{}),
                locationKeys = Object.keys(pointsReduce),
                neighborhoodColor = d3.scaleSequential()
                    .domain([0, locationKeys.length - 1])
                    .interpolator(d3.interpolateSinebow),
                svg = selection.select('svg'),
                g = svg.select('g'),
                zoom = d3.zoom().scaleExtent([.20, 5]).on('zoom', zoomed)
                // projection = d3.geoMercator()
                //     .center([-74.060042, 4.659853])
                //     .scale(1000000),
                //     // .scale(2500000) //SCALE FOR GRANADA
                //     // .translate([(width) / 2, (height)/2]),
                // path = d3.geoPath().projection(projection)
            ;
            function zoomed(event, d) {
                const { transform } = event;
                g.attr('transform', transform)
                // g.attr('stroke-width', 1 / transform.k )
                ;
            }
            Promise.all([
                d3.json('./assets/subunits.json' ),
                d3.json('./assets/routes.json'),
                d3.json('./assets/sectorBounds.json')
            ]).then(([ roads, routes, barrios ]) => {
                 svg.call(zoom)
                ;
                g.selectAll('.path')
                    .data(roads.features)
                    .join('path')
                    .attr('d', path )
                    .attr('id',d => `c-${ d.properties.osm_id }` )
                    .attr('fill', 'none')
                    .attr('stroke', 'lightgrey')
                    .attr('stroke-width', '1px')
                ;
                g.selectAll('subunits')
                    .data(topojson.feature(estratos, estratos.objects.EstratosBogota).features.filter(d => d.properties.Localidad === 'CHAPINERO'))
                    .join('path')
                    .attr('class', 'subunits')
                    // .on('click', clicked) // BRING THIS BACK TO ENABLE ZOOM
                    .attr('d', path )
                    .transition().duration(5000)
                    .call(zoom.transform, zoomTo(neighborhood, 2.5))
                    .attr('fill', '#F7F7F7')
                    // .attr('fill', d => myColor(d.properties[key]) )
                    .each((d,i,t) => d3.select(t[i])
                        .filter(d => Object.keys(pointsReduce).includes( d.properties.SectCatast ))
                        .attr('stroke', d => neighborhoodColor(Object.keys(pointsReduce).indexOf(d.properties.SectCatast)))
                        .transition()
                        .duration(5000)
                        .attr('fill', d => neighborhoodColor(Object.keys(pointsReduce).indexOf(d.properties.SectCatast)))
                        .attr('opacity', .2)
                    )
                ;
                routes.features.map((o,i) => {
                    g.append('defs')
                        .datum(o)
                        .append('path')
                        .attr('id', `curve-${ i }`)
                        .attr('d', path )
                    ;
                    g.append('text')
                        .datum(o)
                        .attr('id',`curve-text-${ i }`)
                        .append('textPath')
                        .attr('xlink:href', `#curve-${ i }`)
                        .text(d => d.properties.name  )
                        .attr('font-size', d => {
                            if ( d.properties.name.includes('Calle') ) { return 5; }
                            else if ( d.properties.name.includes('Bis') ){ return 3; }
                            return 7;
                        })
                        .attr('letter-spacing', d => {
                            if (d.properties.name.includes('Bis')) {
                                return 1
                            } else return 2;
                        })
                })
                ;
                // g.selectAll('names')
                //     .data([neighborhood])
                //     .join('text')
                //     // .enter()
                //     // .append('text')
                //     .attr('transform', d => `translate(${ path.bounds(d)[0][0] },${  path.centroid(d)[1] })`)
                //     .style('opacity', .5 )
                //     .attr('font-size', 7 )
                //     .attr('letter-spacing', 5)
                //     .text(sector)
                //     .each( (d,i,t) => positionSectorName(d,i,t, sector) )
                //;
                g.selectAll('merge')
                    .data(barrios.sectorBounds)
                    // .enter()
                    // .append('text')
                    .join('text')
                    .style('opacity', .8 )
                    .attr('font-size', 7 )
                    .attr('letter-spacing', 5)
                    .text(d => d.sector )
                    .attr('class', 'merge' )
                    .attr('transform', d => `translate(${ d.bounds[0][0] },${  d.centroid[1] })` )
                    .each( (d,i,t) => positionSectorName(d,i,t,d.sector) )
                    .style('fill', '#2c3e50' )
                ;
                g.selectAll('stays')
                    .data(listings.filter(d => d3.geoContains(neighborhood,  [d.location.lng, d.location.lat]) ))
                    .enter()
                    .append('circle')
                    // .attr('class', 'stays')
                    .attr('r', 1)
                    .attr('fill', 'white')
                    .attr('stroke', 'black')
                    .attr('stroke-width', .5)
                    .attr('cx', d => projection([d.location.lng, d.location.lat])[0] )
                    .attr('cy', d => projection([d.location.lng, d.location.lat])[1] )
                    // .style('filter', 'url(#drop-shadow)')
                    .on('click', d => console.log(d.target.__data__))
                ;
                g.selectAll('.points')
                    .data(points)
                    .enter()
                    .append('text')
                    .attr('class', d => `points ${ d.type.replace(/\s+/g,'') }`)
                    .attr('transform', d => `translate(${ projection(d.coordinates)} )`)
                    .attr('x', d => d?.['text_anchor'] === 'end' ? -5 : 5 )
                    .attr('dy', -3 )
                    .style('text-anchor', d => d?.['text_anchor'] )
                    .attr('font-size', 5)
                    .attr('fill', d => d.fill )
                    .attr('font-weight', 600)
                    .text(d => d.name )
                ;
                g.selectAll('.circle')
                    .data(points)
                    .enter()
                    .append('path')
                    .attr('d', 'M 230 80\n' +
                        '           A 45 45, 0, 1, 0, 275 125\n' +
                        '           L 275 80 Z')
                    .attr('transform', d => `translate( ${ projection(d.coordinates)[0] + 17 }, ${projection(d.coordinates)[1] - 10 } ), scale(.07,.07), rotate(135)`)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 8)
                    .attr('class', d => `circle ${ d.type.replace(/\s+/g,'') }`)
                    .attr('fill', d => d.fill )
                ;
                // g.selectAll('.age')
                //     .data(roads.features)
                //     .enter()
                //     .append('text')
                //     .attr("transform", function(d) {
                //         var centroid = path.centroid(d);
                //         return "translate(" + centroid[0] + "," + centroid[1] + ")"
                //     })
                //     .attr("text-anchor", "middle")
                //     .attr("dy", ".35em")
                //     .text(function(d) {
                //         return d.properties.osm_id;
                //     });


                // BRING BACK THE FOLLOWING BLOCK BACK TO RENDER MESH
                // g.append('path')
                //     .datum(topojson.mesh(
                //         geography,
                //         geography.objects.EstratosBogota,
                //         (a, b) => a.properties.SectCatast === b.properties.SectCatast ))
                //     .attr('d', path)
                //     .attr('class', 'state-boundary')

                //EXPIREMENTAL, PRESIMPLIFY GEOJSON
                // g.append('path')
                //     .datum(topojson.mesh(topojson.presimplify(geography)))
                //     .transition()
                //     .duration(10000)
                // ;

                //BRING THE FOLLOWING BLOCK BACK TO RENDER NEIGHBORHOODS

                // svg.append('g').selectAll('.subunit-boundary')
                //     .data([sectors[0]])
                //     .join(
                //         enter => enterPaths(enter),
                //         update => updatePaths(update),
                //         exit => exitPaths(exit)
                //     )

                // Unneeded code
                // .join('path')
                // .attr('class', 'subunit-boundary')
                // .attr('d', path )
                // .attr('fill', d => myColor(d.properties[key]) )

                function enterPaths(enter) {
                    enter.append('g')
                        .attr('class','subunit-boundary')
                        .style('opacity', 0)
                        .call(g => g
                            .transition().duration(5000)
                            .style('opacity', 1)
                        )
                        .call( g => g
                            .append('path')
                            .attr('class', 'subunit-boundary')
                            // .on('click', clicked)
                            .attr('d', path)
                        )

                }

                function updatePaths(update) {
                    update
                        .call(g => g.select('path')
                            .transition().duration(1000)
                            .attr('d', path)

                        )
                }

                function  exitPaths(exit) {
                    exit
                        .call(g =>
                            g.selectAll('.subunit-boundary').transition().duration(1000)
                                .style('opacity', 0)
                                .remove()
                        )
                }

                function clicked(event, d) {
                    const [[x0, y0], [x1, y1]] = path.bounds(d);
                    event.stopPropagation();
                    d3.select(this).transition().style("fill", null);
                    d3.select(this).transition().style("fill", "red");
                    svg.transition().duration(750).call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(width / 2, height / 2)
                            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                        d3.pointer(event, svg.node())
                    );
                }
            });
        }
    }
    ;
    return chart;
}
;
export const updateBogota = props => {
    console.log(props)
    const chart = selection => {
        if (props.hasOwnProperty('value') && props.hasOwnProperty('sector') && props.hasOwnProperty('neighborhood')) {
            // const
            //     { key, value, place_name, sector, neighborhood } = props,
            //     svg = selection.select('svg'),
            //     g = svg.select('g'),
            //     projection = d3.geoMercator()
            //         .center([-74.060042, 4.659853])
            //         .scale(1000000),
            //         // .scale(2500000) //SCALE FOR GRANADA
            //         // .translate([(width) / 2, (height)/2]),
            //     path = d3.geoPath().projection(projection)
            // ;
            // Promise.all([ d3.json('./assets/airbnb.json') ])
            //     .then( ([airbnb]) => {
            //         g.selectAll('.subunits')
            //             .classed('.state.selected', false )
            //             .filter(d => d.properties.SectCatast === sector )
            //             .each((d,i,t) => d3.select(t[i]).attr('class', 'state selected'))
            //         ;
            //         g.selectAll('names')
            //             .data([neighborhood])
            //             .join('text')
            //             .attr('transform', d => {
            //                 const bounds = path.bounds(d);
            //                 const centroid = path.centroid(d);
            //                 return `translate(${ bounds[0][0] },${ centroid[1] })`
            //             })
            //             .text(sector)
            //             .style('opacity', .5 )
            //             .attr('font-size', 7 )
            //             .attr('letter-spacing', 5)
            //             .attr('class','calibri')
            //             .each((d,i,t) => positionSectorName(d,i,t,sector))
            //         ;
            //         g.selectAll('stays')
            //             .data(airbnb.filter(d => d3.geoContains(neighborhood,  [d.location.lng, d.location.lat]) ))
            //             .enter()
            //             .append('circle')
            //             // .attr('class', 'stays')
            //             .attr('r', 1)
            //             .attr('fill', 'white')
            //             .attr('stroke', 'black')
            //             .attr('stroke-width', .5)
            //             .attr('cx', d => projection([d.location.lng, d.location.lat])[0] )
            //             .attr('cy', d => projection([d.location.lng, d.location.lat])[1] )
            //             // .style('filter', 'url(#drop-shadow)')
            //             .on('click', d => console.log(d.target.__data__))
            //     });
        }
    }
    ;
    return chart;
};

export const updateSubunits = props => {
    console.log(props)
    const chart = selection => {
        const
            { estratos, sector, neighborhood } = props,
            svg = selection.select('svg'),
            g = svg.select('g'),
            zoom = d3.zoom().scaleExtent([.20, 5]).on('zoom', zoomed)
        ;
        g.selectAll('.subunits')
            .data(topojson.feature(estratos, estratos.objects.EstratosBogota).features)
            .join(
                    enter => enterPaths(enter),
                    update => updatePaths(update),
                    exit => exitPaths(exit)
            )
            .transition().duration(3000)
            .attr('fill', d => myColor(d.properties.Estrato) )
            // .attr('stroke-width', '1px')
            .attr('stroke', d => myColor(d.properties.Estrato))
        ;
        g.selectAll('.merge')
            .data([neighborhood])
            .join(
                update => updateText(update),
                enter => enterText(enter),
                exit => exitText(exit)
            )
            .transition().duration(10000)
            .call(zoom.transform, zoomTo(neighborhood, 2.5))
        ;
        g.selectAll('.points,.circle')
            .transition()
            .duration(3000)
            .style('opacity', 0 )
        ;

        function enterText(enter) {
            return enter
                // .call( g  =>
                g.append('text')
                .text(d => d)
                .attr('transform', d => `translate(${ path.bounds(d)[0][0]}, ${ path.centroid(d)[1] }`)
            // )
        }

        function enterPaths(enter) {
            return enter
                // .call( g => g
                    .append('path')
                    .attr('fill', '#F7F7F7')
                    .attr('stroke', '#F7F7F7')
                    .attr('stroke-width', '1px')
                    .attr('d', path)
                    // .attr('fill', d => myColor(d.properties.Estrato) )
                    .lower()
                    .each((d,i,t) => {
                        if (d.properties.SectCatast !== sector) return;
                        d3.select(t[i]).classed('state selected', true)
                    })
                // )
        }

        function updatePaths(update) {
            return update
                .call(g => g
                    // .filter( d.properties.SectCatast === sector )
                    // attr('')
                )
        }

        function updateText(update) {
            return update
                .call(g => g.style('opacity', 0.2))
        }

        function exitPaths(exit) {
            return exit
                .call(g => g
                    .style('opacity', 0)
                    .remove()
                )
        }

        function exitText(exit) {
            return exit
                // .call(g => g
                    .transition()
                    .duration(3000)
                    .style('opacity', 0)
                    .remove()
                // )

        }

        function zoomed(event, d) {
            const { transform } = event;
            // g.attr('transform', transform)
            // g.attr('stroke-width', 1 / transform.k )
            ;
        }
    }
    return chart;
}

export const filterLocations = props => {
    const chart = selection => {
        if (props.hasOwnProperty('categoryChange')) {
            const
                { categoryChange, opacity } = props,
                svg = selection.select('svg')
            ;
            svg.selectAll(`.${ categoryChange.label.toUpperCase().replace(/\s+/g,'') }`)
                .transition()
                .duration(1000)
                .style('opacity', opacity )
            ;
        }
    }
    return chart;
}

export const drawLocationPoints = props => {
    const chart = selection => {
        const
            { points } = props,
            svg = selection.select('svg'),
            g = svg.select('g')
        ;

    }
    return chart;
}

export const findNeighborhoods = props => {
    const chart = selection = {

    }
    return chart;
}

