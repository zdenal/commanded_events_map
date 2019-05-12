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
    const options = {
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based', // 'barnesHut', 'repulsion', 'hierarchicalRepulsion', 'forceAtlas2Based'
      },
    };
    const network = new Network(graphRef.current, data, options);
    network.on('selectNode', function(params) {
      onNodeSelect(params.nodes);
    });
  }, [nodes, edges]);

  return <div className="root" ref={graphRef} />;
};

export default memo(FlowGraph);
