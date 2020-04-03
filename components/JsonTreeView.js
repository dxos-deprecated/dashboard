//
// Copyright 2020 Wireline, Inc.
//

import isPlainObject from 'lodash.isplainobject';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MuiTreeView from '@material-ui/lab/TreeView';
import MuiTreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

// TODO(burdon): Move to react-ux.
// TODO(burdon): Style value types (string, number, key, etc.)

const useStyles = makeStyles(() => ({
  itemRoot: {
    display: 'flex',
    flexDirection: 'column',
  },

  labelRoot: {
    display: 'flex',
  },

  label: {},

  value: {
    marginLeft: 8
  }
}));

const TreeItem = ({ nodeId, label, value, children }) => {
  const classes = useStyles();

  return (
    <MuiTreeItem
      className={classes.itemRoot}
      nodeId={nodeId}
      label={(
        <div className={classes.labelRoot}>
          <Typography color="primary" className={classes.label}>{label}</Typography>
          {value && (
            <Typography className={classes.value}>{value}</Typography>
          )}
        </div>
      )}
    >
      {children}
    </MuiTreeItem>
  );
};

const JsonTreeView = ({ data = {}, expanded = [], depth = Infinity, label = '' }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Calculate all IDs.
  const visitor = (node, path = '', ids = [], i = 0) => {
    if (i >= depth) {
      return ids;
    }

    ids.push(path || '_');

    if (isPlainObject(node)) {
      Object.entries(node).forEach(([key, value]) => visitor(value, `${path}.${key}`, ids, i + 1));
    }

    return ids;
  };

  const ids = expanded && expanded.length ? expanded.map(key => `.${key}`) : visitor(data);

  const renderNode = (node, label, level = 0, path = '') => {
    if (isPlainObject(node)) {
      const items = Object.entries(node).map(([key, value]) => renderNode(value, key, level + 1, `${path}.${key}`));
      return level === 0 ? items : (
        <TreeItem key={path} nodeId={path || '.'} label={label}>{items}</TreeItem>
      );
    }

    if (Array.isArray(node)) {
      const items = node.map((value, key) => renderNode(value, `[${key}]`, level + 1, `${path}.${key}`));
      return level === 0 ? items : (
        <TreeItem key={path} nodeId={path} label={label}>{items}</TreeItem>
      );
    }

    return (
      <TreeItem key={path} nodeId={path} label={label} value={node} />
    );
  };

  return (
    <MuiTreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={ids}
      selected={[]}
    >
      {renderNode(data, label)}
    </MuiTreeView>
  );
};

export default JsonTreeView;
