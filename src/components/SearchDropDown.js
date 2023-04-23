import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

const SearchDropDown = (props) => {
  return (
    <Autocomplete
      disablePortal
      style={{ margin: 10 }}
      id="combo-box-demo"
      sx={{ width: 300 }}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderInput={(params) => <TextField {...params} label={props.label} />}
      {...props}
    />
  );
};

export default SearchDropDown;
