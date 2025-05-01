import React from 'react';
import { Kbd } from 'reablocks';

export default {
  title: 'Components/Elements/Kbd',
  component: Kbd
};

export const Basic = () => (
  <>
    <Kbd keycode="mod+shift+k" />
  </>
);
