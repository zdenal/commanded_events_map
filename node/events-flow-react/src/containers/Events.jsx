import React, {useState, useEffect} from 'react';
import _ from 'lodash';

import {convertData, findNodeDeps, findEdgeDeps} from '../graphUtils';
import FlowGraph from '../components/FlowGraph';
import FilterSelect from '../components/FilterSelect';

export default ({resolution, loadResolution, dispute, isLoading}) => {
  const [data, setData] = useState({nodes: [], edges: []});
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [filterSelectedNodes, setFilterSelectedNodes] = useState([]);
  const [filterSelectedEdges, setFilterSelectedEdges] = useState([]);

  const initData = data => {
    const preparedData = convertData(data);

    setData(preparedData);
    setSelectedNodes(preparedData.nodes);
    setSelectedEdges(preparedData.edges);
  };

  useEffect(() => {
    fetch('http://localhost:5000')
      .then(function(response) {
        return response.json();
      })
      .then(json => initData(json));
  }, []);

  useEffect(
    () => {
      if (
        filterSelectedNodes.length === 0 &&
        filterSelectedEdges.length === 0
      ) {
        setSelectedNodes(data.nodes);
        return;
      }

      const search = {nodeIds: []};

      if (filterSelectedEdges.length > 0) {
        search.nodeIds = findEdgeDeps(
          filterSelectedEdges,
          data.nodes,
          data.edges,
        );

        search.edges = data.edges.filter(e =>
          filterSelectedEdges.includes(e.label),
        );
      }

      if (filterSelectedNodes.length > 0) {
        search.nodeIds = findNodeDeps(
          filterSelectedNodes.concat(search.nodeIds),
          data.nodes,
          search.edges || data.edges,
        ).concat(search.nodeIds);
      }

      const filteredNodes = data.nodes.filter(node =>
        search.nodeIds.includes(node.id),
      );

      setSelectedNodes(filteredNodes);
      setSelectedEdges(search.edges || data.edges);
    },
    [filterSelectedNodes, filterSelectedEdges],
  );

  const handleNodesChange = e => {
    setFilterSelectedNodes(e.target.value);
  };

  const handleEdgesChange = e => {
    setFilterSelectedEdges(e.target.value);
  };

  if (selectedNodes.length === 0) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <FilterSelect
        items={data.nodes.map(node => ({
          id: node.id,
          label: node.label,
          type: node.group,
        }))}
        selectedItems={filterSelectedNodes}
        handleChange={handleNodesChange}
        placeholder="Please select nodes to filter"
      />
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
      <FlowGraph nodes={selectedNodes} edges={selectedEdges} />
    </>
  );
};
