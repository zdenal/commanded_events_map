import React, {useState, useEffect, memo} from 'react';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import FilterSelect from '../FilterSelect';
import {findNodeDeps, findEdgeDeps} from '../../graphUtils';

const Filter = ({data, setSelectedNodes, setSelectedEdges}) => {
  const [filterSelectedNodes, setFilterSelectedNodes] = useState([]);
  const [filterSelectedEdges, setFilterSelectedEdges] = useState([]);

  const handleNodesChange = ({target: {value}}, e) => {
    console.log(e, value);
    setFilterSelectedNodes(value);
  };

  const handleEdgesChange = ({target: {value}}, e) => {
    console.log(e, value);
    setFilterSelectedEdges(value);
  };

  const style = {
    filter: {
      padding: 12,
      textAlign: 'center',
    },
  };

  useEffect(() => {
    const selectedNodesIds = filterSelectedNodes.map(s => s.id);
    const selectedEdgesIds = filterSelectedEdges.map(s => s.id);

    if (selectedNodesIds.length === 0 && selectedEdgesIds.length === 0) {
      setSelectedNodes(data.nodes);
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
      ).concat(search.nodeIds);
    }

    const filteredNodes = data.nodes.filter(node =>
      search.nodeIds.includes(node.id),
    );

    setSelectedNodes(filteredNodes);
    setSelectedEdges(search.edges || data.edges);
  }, [filterSelectedNodes, filterSelectedEdges]);

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
      <Grid item xs={6}>
        <FilterSelect
          items={nodeItems}
          selectedItems={filterSelectedNodes}
          handleChange={handleNodesChange}
          placeholder="Please select nodes to filter"
        />
      </Grid>
      <Grid item xs={6}>
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
          placeholder="Please select events to filter"
        />
      </Grid>
    </Grid>
  );
};

export default memo(Filter, (prev, next) => prev.data === next.data);
