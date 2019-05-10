import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import {convertData} from '../graphUtils';
import FlowGraph from '../components/FlowGraph';
import Filter from '../components/Filter';
import NodeDialog from '../components/NodeDialog';

export default ({resolution, loadResolution, dispute, isLoading}) => {
  const [data, setData] = useState({nodes: [], edges: []});
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [selectedNodeDialog, selectNodeDialog] = useState({});
  const [nodeDialogOpen, toggleNodeDialog] = useState(false);

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

  const onNodeSelect = nodes => {
    console.log(selectedNodes, nodes);
    selectNodeDialog(selectedNodes.filter(n => n.id === nodes[0])[0]);
    //toggleNodeDialog(true);
  };

  if (selectedNodes.length === 0) {
    return <div>Loading ...</div>;
  }

  const style = {
    root: {
      flexGrow: 1,
    },
    graph: {
      height: 900,
    },
  };

  return (
    <div style={style.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper>
            <Filter
              data={data}
              setSelectedNodes={setSelectedNodes}
              setSelectedEdges={setSelectedEdges}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={style.graph}>
            <FlowGraph
              nodes={selectedNodes}
              edges={selectedEdges}
              onNodeSelect={onNodeSelect}
            />
          </Paper>
        </Grid>
      </Grid>
      <NodeDialog
        node={selectedNodeDialog}
        isOpen={nodeDialogOpen}
        toggle={toggleNodeDialog}
      />
    </div>
  );
};
