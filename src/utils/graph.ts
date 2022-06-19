import { search } from 'src/utils';

/**
 * It creates a 2D array of size n x n and fills it with zeros
 * @param {number} n - number of nodes in the graph
 * @returns A matrix of size n x n with all 0s.
 */
const createGraphMatrix = (n: number): number[][] => {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(-1);
    }
    matrix.push(row);
  }

  return matrix;
};

/**
 * It takes a dictionary and returns a matrix `
 * @param graphDict - the graph dictionary
 * @returns A matrix of the graph
 */
const convertDict2MatrixForGraph = (graphDict) => {
  const keys = Object.keys(graphDict);
  const matrix_graph: number[][] = createGraphMatrix(keys.length);
  for (const key of keys) {
    const neighbor = graphDict[key];
    for (const key_nei of Object.keys(neighbor)) {
      const weight = neighbor[key_nei];
      const index_g_i = keys.indexOf(key);
      const index_g_j = keys.indexOf(key_nei);

      matrix_graph[index_g_i][index_g_j] = weight;
    }
  }

  return matrix_graph;
};

/**
 * It takes in a graph, a list of paths, a start node, and an end node, and returns a string of the
 * path from the start node to the end node
 * @param {any} graph - the graph object
 * @param {number[][]} paths - the array of paths from the start node to the end node
 * @param {number} start - the starting node
 * @param {number} end - the end node
 * @returns A string of the path from the start to the end.
 */
const convertArryPath2StringPath = (
  graph: any,
  paths: number[][],
  start: number,
  end: number,
) => {
  for (const path of paths) {
    if (path.length === 0) continue;
    if (!search.isNumberInArray(path, start)) path.splice(0, 0, start);
  }

  if (paths[end].length === 0) return '';

  let path_string = '';

  for (const path of paths[end]) {
    if (path_string == '') path_string = Object.keys(graph)[path];
    else path_string = `${path_string} -> ${Object.keys(graph)[path]}`;
  }

  return path_string;
};

/**
 * It takes an object and a target string, and returns the index of the target string in the object
 * @param object - The object you want to search through.
 * @param {string} target - The target string that you want to find the index of.
 * @returns The index of the target string in the object.
 */
const getIndexFromObject = (object, target: string) => {
  return Object.keys(object).indexOf(target);
};

/**
 * "We start at the start node, and then we visit all of its neighbors, and then we visit all of their
 * neighbors, and so on."
 *
 * The function takes in a graph and a start node. It returns an array of distances from the start node
 * to all other nodes
 * @param {number[][]} graph - The adjacency matrix of the graph.
 * @param {number} start - the starting node
 * @returns The distances from the start node to all other nodes.
 */
const bfs = (graph: number[][], start: number) => {
  // Initialize node data
  const queue: number[] = [];
  queue.push(start);

  const visited: boolean[] = [];
  for (const _ of graph) {
    visited.push(false);
  }
  visited[start] = true;
  const distances: number[] = [];
  for (const _ of graph) {
    distances.push(0);
  }

  const paths: number[][] = [];
  for (const _ of graph) {
    paths.push([]);
  }

  while (queue.length > 0) {
    const node = queue.shift();

    if (!node && node !== 0) break;

    for (let i = 0; i < graph[node].length; i++) {
      // Weight is not negative and never visited
      if (graph[node][i] >= 0 && !visited[i]) {
        // Mark as visited
        visited[i] = true;
        // Cal distance
        distances[i] = distances[node] + graph[node][i];
        // Track path
        paths[i].push(...paths[node], i);
        // Push for new node
        queue.push(i);
      }
    }
  }
  return {
    distances: distances,
    paths: paths,
  };
};

/**
 * We convert the graph from a dictionary to a matrix, then we use the BFS algorithm to find the
 * shortest path from the start node to the end node
 * @param {any} graph - a dictionary of the graph, where the key is the node and the value is a list of
 * the nodes that are connected to it.
 * @param {string} start - The name of the node you are starting at.
 * @param {string} end - The name of the node you want to find a path to
 * @returns The shortest path between two nodes in a graph.
 */
const findShortestPath = (graph: any, start: string, end: string) => {
  const matrix_graph = convertDict2MatrixForGraph(graph);
  const start_idx = getIndexFromObject(graph, start);
  const end_idx = getIndexFromObject(graph, end);

  if (start_idx === end_idx)
    return {
      distance: 0,
      path: `${start} -> ${end}`,
    };

  const result = bfs(matrix_graph, start_idx);

  return {
    distance: result.distances[end_idx] ? result.distances[end_idx] : -1,
    path: convertArryPath2StringPath(graph, result.paths, start_idx, end_idx),
  };
};

export { findShortestPath };
