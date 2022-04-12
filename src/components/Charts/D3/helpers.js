import * as d3 from 'd3';
import drawCartography from './drawCartography';
import { drawBogota, updateBogota, filterLocations, drawLocationPoints, updateSubunits } from './drawBogota';

export const createMap = props => {
  const { id } = props;
  // const chart = drawCartography({...props});
  const chart = drawBogota({...props});
  d3.select(`#${ id }`)
    .call(chart);
};

export const addSubunits = props => {
  const { id } = props;
  const chart = updateSubunits({...props });
  d3.select(`#${ id }`)
      .call(chart);
}

export const updateMap = ({ id }) => {
  const chart = updateCartography();
  d3.select(`#${ id }`)
    .call(chart);
};

export const changeSector = props => {
  const { id } = props;
  const chart = updateBogota({ ...props });
  d3.select(`#${ id }`)
      .call(chart);
};

export const drawLocations = props => {
  const { id } = props;
  const chart = drawLocationPoints({ ...props });
  d3.select(`#${ id }`)
      .call(chart);
};

export const removeLocations = props => {
  const { id } = props;
  const chart = filterLocations({ ...props, opacity: 0 });
  d3.select(`#${ id }`)
      .call(chart);
};

export const addLocations = props => {
  const { id } = props;
  const chart = filterLocations({ ...props, opacity: 1 });
  d3.select(`#${ id }`)
      .call(chart);
};


