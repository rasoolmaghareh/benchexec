/* SPDX-License-Identifier: Apache-2.0
 *
 * BenchExec is a framework for reliable benchmarking.
 * This file is part of BenchExec.
 * Copyright (C) Dirk Beyer. All rights reserved.
 */
const prepareTableData = ({ head, tools, rows, stats, props }) => {
  return {
    tableHeader: head,
    tools: tools.map(tool => ({
      ...tool,
      isVisible: true,
      columns: tool.columns.map(column => ({ ...column, isVisible: true }))
    })),
    columns: tools.map(tool => tool.columns.map(column => column.title)),
    table: rows,
    stats: stats,
    properties: props
  };
};

const applyFilter = (filter, row, cell) => {
  const { original } = row[filter.id];
  const filterParams = filter.value.split(":");

  if (filterParams.length === 2) {
    const [start, end] = filterParams;

    const numOriginal = Number(original);
    const numStart = Number(start);
    const numEnd = end ? Number(end) : Infinity;

    return numOriginal >= numStart && numOriginal <= numEnd;
  }

  if (filterParams.length === 1) {
    return original.startsWith(filterParams[0]);
  }
  return false;
};

const isNil = data => data === undefined || data === null;

const pathOr = (defaultValue, path) => data => {
  if (!path || !(path instanceof Array) || !data) {
    return defaultValue;
  }
  let subPathResult = data;
  for (const node of path) {
    subPathResult = subPathResult[node];
    if (isNil(subPathResult)) {
      return defaultValue;
    }
  }
  return subPathResult;
};

const getOriginalOrNegInfinity = pathOr(-Infinity, ["original"]);

const sortMethod = (a, b) => {
  const aValue = getOriginalOrNegInfinity(a);
  const bValue = getOriginalOrNegInfinity(b);
  return bValue - aValue;
};

const pipe = (...functions) => data => {
  let subResult = data;
  for (const func of functions) {
    subResult = func(subResult);
  }
  return subResult;
};

const maybeTransformToLowercase = data =>
  data && typeof data === "string" ? data.toLowerCase() : data;

const isOkStatus = status => {
  return status === 0 || status === 200;
};

export {
  prepareTableData,
  applyFilter,
  sortMethod,
  isOkStatus,
  pathOr,
  isNil,
  pipe,
  maybeTransformToLowercase
};
