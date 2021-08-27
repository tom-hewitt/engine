import {
  addNode,
  deleteNode,
  Nodes,
  reorderNode,
} from "../../algorithms/nodes";

it("adds a node", () => {
  const initialState: Nodes = {
    "0": {},
  };

  const newState = addNode(initialState, {}, "1", "0");

  expect(newState).toEqual({
    "0": {
      parent: undefined,
      child: "1",
    },
    "1": {
      parent: "0",
      child: undefined,
    },
  });
});

it("deletes a node", () => {
  const initialState: Nodes = {
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "2",
    },
    "2": {
      parent: "1",
    },
  };

  const newState = deleteNode(initialState, "1");

  expect(newState).toEqual({
    "0": {
      child: "2",
    },
    "2": {
      parent: "0",
    },
  });
});

it("reorders a node", () => {
  const initialState: Nodes = {
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "2",
    },
    "2": {
      parent: "1",
      child: "3",
    },
    "3": {
      parent: "2",
    },
  };

  const newState = reorderNode(initialState, "1", "2");

  expect(newState).toEqual({
    "0": {
      child: "2",
    },
    "1": {
      parent: "2",
      child: "3",
    },
    "2": {
      parent: "0",
      child: "1",
    },
    "3": {
      parent: "1",
    },
  });
});

it("reorders a node to the end", () => {
  const initialState: Nodes = {
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "2",
    },
    "2": {
      parent: "1",
      child: "3",
    },
    "3": {
      parent: "2",
    },
  };

  const newState = reorderNode(initialState, "1", "3");

  expect(newState).toEqual({
    "0": {
      child: "2",
    },
    "1": {
      parent: "3",
      child: undefined,
    },
    "2": {
      parent: "0",
      child: "3",
    },
    "3": {
      parent: "2",
      child: "1",
    },
  });
});

it("reorders a node from the end", () => {
  const initialState: Nodes = {
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "2",
    },
    "2": {
      parent: "1",
      child: "3",
    },
    "3": {
      parent: "2",
    },
  };

  const newState = reorderNode(initialState, "3", "1");

  expect(newState).toEqual({
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "3",
    },
    "2": {
      parent: "3",
      child: undefined,
    },
    "3": {
      parent: "1",
      child: "2",
    },
  });
});

it("reorders a node from the start", () => {
  const initialState: Nodes = {
    "0": {
      child: "1",
    },
    "1": {
      parent: "0",
      child: "2",
    },
    "2": {
      parent: "1",
      child: "3",
    },
    "3": {
      parent: "2",
    },
  };

  const newState = reorderNode(initialState, "0", "2");

  expect(newState).toEqual({
    "0": {
      parent: "2",
      child: "3",
    },
    "1": {
      parent: undefined,
      child: "2",
    },
    "2": {
      parent: "1",
      child: "0",
    },
    "3": {
      parent: "0",
    },
  });
});
