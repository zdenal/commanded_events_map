import _ from 'lodash';

const typeColor = {
  aggregate: 'blue',
  handler: 'green',
};
const typeShape = {
  aggregate: 'box',
  handler: 'ellipse',
};

const transformToNode = node => {
  return {
    id: node.name,
    label: node.label,
    content: node.content,
    color: typeColor[node.type],
    group: node.type,
    font: {
      size: 20,
      bold: true,
    },
    shape: typeShape[node.type],
  };
};

const edgesTo = (aggregate, handlers) => {
  return aggregate.events.flatMap(event => {
    return handlers
      .filter(handler => handler.events.includes(event))
      .map(handler => {
        return {
          from: aggregate.name,
          to: handler.name,
          label: event,
          arrows: {
            to: true,
          },
        };
      });
  });
};

export const findEdgeDeps = (edgeLabels, nodes, edges) => {
  return edges
    .filter(e => edgeLabels.includes(e.label))
    .flatMap(e => [e.from, e.to]);
};

export const findNodeDeps = (nodeIds, nodes, edges) => {
  if (nodeIds.length === 0) return nodes.map(n => n.id);

  const foundEdges = edges.filter(
    //edge => nodeIds.includes(edge.from) || nodeIds.includes(edge.to),
    edge => nodeIds.includes(edge.from),
  );

  const nextNodeIds = _.uniq(
    foundEdges.map(e => e.from).concat(foundEdges.map(e => e.to)),
  );

  if (nextNodeIds.length === 0) return nodeIds;
  if (_.difference(nextNodeIds, nodeIds).length === 0) return nodeIds;

  return findNodeDeps(_.uniq(nodeIds.concat(nextNodeIds)), nodes, edges);
};

export const convertData = data => {
  const handlers = data.nodes.filter(node => node.type === 'handler');
  const aggregates = data.nodes.filter(node => node.type === 'aggregate');
  const edges = aggregates.flatMap(aggregate => edgesTo(aggregate, handlers));
  const nodes = data.nodes.map(transformToNode);

  return {
    nodes: nodes,
    edges: edges,
  };
};
