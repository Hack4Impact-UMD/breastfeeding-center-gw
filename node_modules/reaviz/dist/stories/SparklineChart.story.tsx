import React from 'react';

import {
  singleDateData,
  medDateData,
  smallDateData,
  sonarData,
  sonarDataEmpties
} from 'reaviz-data-utils';
import { SparklineChart } from 'reaviz';
import { AreaSparklineChart } from 'reaviz';
import { BarSparklineChart } from 'reaviz';
import { SonarChart } from 'reaviz';

export default {
  tags: ['snapshot'],
  title: 'Charts/Sparkline'
};

export const Line = () => (
  <SparklineChart id="line" width={200} height={55} data={medDateData} />
);

export const Area = () => (
  <AreaSparklineChart id="area" width={200} height={85} data={singleDateData} />
);

export const Bar = () => (
  <BarSparklineChart id="bar" width={200} height={35} data={smallDateData} />
);

export const Sonar = () => (
  <SonarChart id="sonar" width={300} height={50} data={sonarData} />
);

export const SonarEmpties = () => (
  <SonarChart
    id="sonar-empties"
    width={300}
    height={50}
    data={sonarDataEmpties}
  />
);
