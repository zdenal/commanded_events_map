import React, {useEffect, memo, createRef} from 'react';
import {DataSet, Network} from 'vis';
import 'vis/dist/vis.css';
import './index.css';

const FlowGraph = ({nodes, edges}) => {
  const data = {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges),
  };

  const graphRef = createRef();

  useEffect(() => {
    new Network(graphRef.current, data, {});
  });

  return <div className="root" ref={graphRef} />;
};

export default memo(FlowGraph);
