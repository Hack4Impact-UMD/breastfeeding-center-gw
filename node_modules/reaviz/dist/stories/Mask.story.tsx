import React from 'react';
import { Mask } from 'reaviz';
import { Area, AreaChart, AreaSeries } from 'reaviz';
import { singleDateData } from 'reaviz-data-utils';
import { Stripes } from 'reaviz';

export default {
  title: 'Utils/Mask',
  component: Mask,
  subcomponents: {
    Stripes
  }
};

export const Simple = () => (
  <AreaChart
    width={350}
    height={250}
    data={singleDateData}
    series={<AreaSeries area={<Area mask={<Stripes />} />} />}
  />
);
