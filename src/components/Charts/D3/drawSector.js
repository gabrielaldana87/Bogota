import * as d3 from 'd3';

const drawSector = props => {
    const chart = selection => {
        if (props.hasOwnProperty('value')) {
            const
                { value } = props,
                svg = selection.select('svg')
            console.log(value, svg.selectAll('.state.selected').data())

        }
    }
    ;
    return chart;
}

export default  drawSector;
