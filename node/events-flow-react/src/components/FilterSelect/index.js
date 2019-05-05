import React from 'react';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

export default ({items, selectedItems, handleChange, placeholder}) => {
  return (
    <FormControl>
      <Select
        multiple
        displayEmpty
        renderValue={selected => {
          if (selected.length === 0) {
            return <em>{placeholder}</em>;
          }

          return selected.join(', ');
        }}
        onChange={handleChange}
        value={selectedItems}
        input={<Input id="nodes-select" />}>
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {items.map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.label} ({item.type})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
