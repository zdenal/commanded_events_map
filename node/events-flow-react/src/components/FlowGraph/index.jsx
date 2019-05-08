import React, {useEffect, memo, createRef} from 'react';
import {DataSet, Network} from 'vis';
import 'vis/dist/vis.css';
import './index.css';

const FlowGraph = ({nodes, edges, onNodeSelect}) => {
  const data = {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  };

  const graphRef = createRef();

  useEffect(() => {
    const network = new Network(graphRef.current, data, {});
    network.on('selectNode', function(params) {
      onNodeSelect(params.nodes);
    });
  }, [nodes, edges]);

  return <div className="root" ref={graphRef} />;
};

export default memo(FlowGraph);
