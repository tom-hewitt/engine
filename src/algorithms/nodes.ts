interface Node {
  parent?: string;
  child?: string;
  [key: string]: any;
}

export interface Nodes {
  [key: string]: Node;
}

export const addNode = (
  nodes: Nodes,
  data: { [key: string]: any },
  id: string,
  parent: string
) => {
  const node = Object.assign(data, {
    parent,
    child: nodes[parent].child,
  });
  nodes[id] = node;

  if (parent) {
    const child = nodes[parent].child;
    if (child) {
      nodes[child].parent = id;
    }
    nodes[parent].child = id;
  }

  return nodes;
};

export const deleteNode = (nodes: Nodes, id: string) => {
  const parent = nodes[id].parent;
  const child = nodes[id].child;

  if (parent) {
    nodes[parent].child = child;
  }
  if (child) {
    nodes[child].parent = parent;
  }

  delete nodes[id];

  return nodes;
};

export const reorderNode = (nodes: Nodes, id: string, newParent: string) => {
  const newChild = nodes[newParent].child;
  const oldParent = nodes[id].parent;
  const oldChild = nodes[id].child;

  // Link the old parent and the old child
  if (oldParent) {
    nodes[oldParent].child = oldChild;
  }
  if (oldChild) {
    nodes[oldChild].parent = oldParent;
  }

  // Link the node and it's new parent
  nodes[id].parent = newParent;
  nodes[newParent].child = id;

  // Link the node and it's new child
  nodes[id].child = newChild;
  if (newChild) {
    nodes[newChild].parent = id;
  }

  return nodes;
};
