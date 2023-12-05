import React from 'react';

import Select from 'react-select';
import { colourOptions } from '../data';

export default () => {
  return (
    <>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        name="color"
        options={colourOptions}
      />
    </>
  );
};
