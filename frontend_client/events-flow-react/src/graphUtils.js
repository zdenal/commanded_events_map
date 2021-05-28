import _ from "lodash";

const typeColor = {
  aggregate: "blue",
  handler: "green",
};
const typeShape = {
  aggregate: "box",
  handler: "ellipse",
};

const transformToNode = (node) => {
  return {
    id: node.name,
    label: node.name.split("/").slice(-3).join(" / "),
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

const edgesTo = (fromNode, nodes, link) => {
  return fromNode[link].flatMap((event) => {
    return nodes
      .filter((node) => node[link].includes(event))
      .map((node) => {
        return {
          from: fromNode.name,
          to: node.name,
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
    .filter((e) => edgeLabels.includes(e.label))
    .flatMap((e) => [e.from, e.to]);
};

export const findNodeDeps = (nodeIds, nodes, edges, level) => {
  if (nodeIds.length === 0) return nodes.map((n) => n.id);
  if (level < 1) return nodeIds;

  const foundEdges = edges.filter(
    (edge) => nodeIds.includes(edge.from) || nodeIds.includes(edge.to)
    //edge => nodeIds.includes(edge.from),
  );

  const nextNodeIds = _.uniq(
    foundEdges.map((e) => e.from).concat(foundEdges.map((e) => e.to))
  );

  if (nextNodeIds.length === 0) return nodeIds;
  if (_.difference(nextNodeIds, nodeIds).length === 0) return nodeIds;

  return findNodeDeps(
    _.uniq(nodeIds.concat(nextNodeIds)),
    nodes,
    edges,
    level - 1
  );
};

export const convertData = (data) => {
  const types = {};

  Object.keys(data.outputs).forEach((type) => {
    types[type] = data.nodes.filter((node) => node.type === type);
  });

  const edges = Object.keys(data.outputs).flatMap((type) => {
    const { output, targets } = data.outputs[type];

    if (output === null || targets === null) return [];

    const targetTypes = targets.flatMap((t) => types[t]);

    return types[type].flatMap((n) => edgesTo(n, targetTypes, output));
  });

  const nodes = data.nodes.map(transformToNode);

  return {
    nodes: nodes,
    edges: edges,
  };
};
