import React from 'react';
import { DiscreteLegend } from 'reaviz';
import { DiscreteLegendEntry } from 'reaviz';

export default {
  title: 'Utils/Legend/Discrete/Horizontal'
};

export const _Simple = () => (
  <DiscreteLegend
    orientation="horizontal"
    entries={[
      <DiscreteLegendEntry label="DLP" color="green" />,
      <DiscreteLegendEntry label="SIEM" color="blue" />,
      <DiscreteLegendEntry label="AWS" color="yellow" />,
      <DiscreteLegendEntry label="AD" color="purple" />
    ]}
  />
);
