import React from 'react';

import { SelectFunctional } from 'react-select';
import { colourOptions } from '../data';

export default () => {
  return (
    <>
      <SelectFunctional
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        name="color"
        options={colourOptions}
      />
    </>
  );
};
