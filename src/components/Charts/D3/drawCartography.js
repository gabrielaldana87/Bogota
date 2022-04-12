import * as d3 from 'd3';
import * as topojson from 'topojson';

const drawCartography = props => {
  const chart = selection => {
    if (props.hasOwnProperty('value')) {
    const
      { key, value, place_name } = props,
        width = 1200,
        height = 1000,
        projection = d3.geoMercator()
              // .center([-75.590553, 6.230833])//Medellin
          .center([-74.0977, 4.6252])//Bogota (ENABLE THIS ONE WHEN READY)
              //  .center([-76.538565, 3.412889])//Cali
            .scale(1000000)//Medellin + Bogota ADY)

            // .scale(150000)//Medellin + Bogota (ENABLE THIS ONE WHEN READY)
              //  .scale(300000)//Cali
          .translate([(width) / 2, (height)/2]),
        myColor = d3.scaleSequential()
          .domain([1,6])
          .interpolator(d3.interpolateViridis),
        svg = selection.select('svg'),
          // .attr('width', width )
          // .attr('height', height ),
        path = d3.geoPath().projection(projection),
        t = svg.transition().duration(750),
        g = svg.select('g')
      ;
      d3.json(`./assets/Estratos${ value }.topojson`)
          .then(geography => {
            var borders = topojson.mesh(
                geography,
                geography.objects.EstratosBogota,
                function(a, b) {
                  return a.properties.SectCatast !== b.properties.SectCatast
                }
            );

            console.log('borders', borders);

          });
      d3.json(`./assets/Estratos${ value }.geojson`)
        .then(geography => {
          if (value !== 'Bogota') {
            projection.fitSize([width,height], geography);
          }
          g.selectAll('text').text('')
          const pathUpdate = g.selectAll('path')
            .data(geography.features.splice(0,42591))
            // .call( update => update.transition(t)
              // .enter()
              // .append('path')
            .attr('d', path )
              // .attr('stroke', 'lightgrey')
              // .attr('stroke-width', '.5px')
            .attr('fill', d => myColor(d.properties[key]) )
            .on('mouseover', (evt, d) => {
              return text
                .text(d.properties[place_name])
                .attr('x', (evt.pageX) + 'px')
                .attr('y', (evt.pageY - 200) + 'px');
              // return `<span>${ d.properties.NOMBRE }</span>`
          })

          ;
          const pathEnter = pathUpdate
            .enter()
            .append('path')
            .attr('d', path )
            .attr('fill', d => myColor(d.properties[key]) )
            .on('mouseover', (evt, d) => {
              return text
                .text(`${ d.properties[place_name] } : ${ d.properties.CodManzana }`)
                .attr("x", (evt.pageX) + "px")
                .attr("y", (evt.pageY - 200) + "px");
                // return `<span>${ d.properties.NOMBRE }</span>`
            })
          ;
          const text = g.append('text')
            .style('font-family', 'Avenir Next' )
            .style('fill', 'grey')
          ;
          const pathExit = pathUpdate
            .exit()
            .attr('fill', 'black')
            // .call( exit => exit.transition(t)
            .attr('d', path )
            .remove()
        // )






        })
      } else  return;
  };
  return chart;
}

export default drawCartography;
