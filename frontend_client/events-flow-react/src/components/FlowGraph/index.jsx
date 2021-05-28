import React, { useEffect, memo, createRef } from "react";
import { DataSet, Network } from "vis";
import "vis/dist/vis.css";
import "./index.css";

const FlowGraph = ({ nodes, edges, onNodeSelect }) => {
  const graphRef = createRef();

  useEffect(() => {
    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based", // 'barnesHut', 'repulsion', 'hierarchicalRepulsion', 'forceAtlas2Based'
      },
    };
    const network = new Network(graphRef.current, data, options);
    network.on("selectNode", function (params) {
      onNodeSelect(params.nodes);
    });
  }, [nodes, edges, graphRef, onNodeSelect]);

  return <div className="root" ref={graphRef} />;
};

export default memo(FlowGraph);
