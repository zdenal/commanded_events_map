import React, {useState, useEffect, memo} from 'react';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import FilterSelect from '../FilterSelect';
import {findNodeDeps, findEdgeDeps} from '../../graphUtils';

const Filter = ({
  data,
  setSelectedNodes,
  setSelectedEdges,
  toggleNodeDialog,
}) => {
  const [filterSelectedNodes, setFilterSelectedNodes] = useState([]);
  const [filterSelectedEdges, setFilterSelectedEdges] = useState([]);
  const [depth, setDepth] = useState(1);

  const handleNodesChange = ({target: {value}}, e) => {
    setFilterSelectedNodes(value);
  };

  const handleEdgesChange = ({target: {value}}, e) => {
    setFilterSelectedEdges(value);
  };

  const style = {
    filter: {
      padding: 12,
      textAlign: 'center',
    },
  };

  useEffect(() => {
    const selectedNodesIds = filterSelectedNodes;
    const selectedEdgesIds = filterSelectedEdges;

    if (selectedNodesIds.length === 0 && selectedEdgesIds.length === 0) {
      setSelectedNodes(data.nodes);
      setSelectedEdges(data.edges);
      return;
    }

    const search = {nodeIds: []};

    if (selectedEdgesIds.length > 0) {
      search.nodeIds = findEdgeDeps(selectedEdgesIds, data.nodes, data.edges);

      search.edges = data.edges.filter(e => selectedEdgesIds.includes(e.label));
    }

    if (selectedNodesIds.length > 0) {
      search.nodeIds = findNodeDeps(
        selectedNodesIds.concat(search.nodeIds),
        data.nodes,
        search.edges || data.edges,
        depth,
      ).concat(search.nodeIds);
    }

    const filteredNodes = data.nodes.filter(node =>
      search.nodeIds.includes(node.id),
    );

    setSelectedNodes(filteredNodes);
    setSelectedEdges(search.edges || data.edges);
  }, [filterSelectedNodes, filterSelectedEdges, depth]);

  const nodeItems = data.nodes.map(node => ({
    id: node.id,
    label: node.label,
    type: node.group,
  }));

  return (
    <Grid
      style={style.filter}
      container
      item
      justify="space-around"
      direction="row"
      alignItems="center">
      <Grid item xs={5}>
        <FilterSelect
          items={nodeItems}
          selectedItems={filterSelectedNodes}
          handleChange={handleNodesChange}
          placeholder="Please select nodes to filter"
        />
      </Grid>
      <Grid item xs={1}>
        <TextField
          label="Depth"
          value={depth}
          inputProps={{min: 0}}
          onChange={event => setDepth(event.target.value)}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={5}>
        <FilterSelect
          items={_.chain(data.edges)
            .map(edge => ({
              id: edge.label,
              label: edge.label,
            }))
            .uniqBy('id')
            .value()}
          selectedItems={filterSelectedEdges}
          handleChange={handleEdgesChange}
          placeholder="Please select edges to filter"
        />
      </Grid>
      <Grid item xs={1}>
        <IconButton
          onClick={() => toggleNodeDialog(true)}
          color="primary"
          component="span">
          <DescriptionIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default memo(Filter, (prev, next) => prev.data === next.data);
