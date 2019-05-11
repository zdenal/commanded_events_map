import React from 'react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default ({items, selectedItems, handleChange, placeholder}) => {
  return (
    <FormControl>
      <Select
        multiple
        displayEmpty
        renderValue={selected => {
          return <em>{placeholder}</em>;
        }}
        onChange={handleChange}
        value={selectedItems}
        input={<OutlinedInput />}>
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {items.map(item => {
          return (
            <MenuItem key={item.id} value={item.id}>
              <ListItemText inset>
                {item.label} ({item.type})
              </ListItemText>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
