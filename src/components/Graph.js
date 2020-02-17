//
// Copyright 2020 DxOS
//

import { useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';

/**
 * https://www.npmjs.com/package/react-force-graph
 * @param data
 * @param distance
 * @returns {*}
 * @constructor
 */
const Graph = ({ data, distance = 1000 }) => {
  const graph = useRef();

  // Rotation.
  useEffect(() => {
    if (!graph.current.cameraPosition) {
      return;
    }

    graph.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    const interval = setInterval(() => {
      graph.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      });

      // TODO(burdon): By time.
      angle += Math.PI / 300;

      if (distance > 750) {
        distance -= 1;
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // TODO(burdon): Auto-size.
  // https://github.com/vasturiano/react-force-graph/blob/master/src/forcegraph-proptypes.js

  return (
    <ForceGraph3D
      ref={graph}
      graphData={data}
      enableNodeDrag={false}
      enableNavigationControls={true}
      showNavInfo={false}
      nodeColor={() => '#CCCCCC'}
      nodeRelSize={5}
      nodeLabel={node => String(node.id)}
      linkColor={() => '#AAAAAA'}
      linkWidth={2}
      backgroundColor="#333333"
    />
  );
};

export default Graph;
