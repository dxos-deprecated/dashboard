//
// Copyright 2020 Wireline, Inc.
//

import { useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';

// https://www.npmjs.com/package/react-force-graph

const Graph = ({ data, distance = 1000 }) => {
  const graph = useRef();

  useEffect(() => {
    if (!graph.current) {
      return;
    }

    graph.current.cameraPosition({ z: distance });

    // camera orbit
    let angle = 0;
    setInterval(() => {
      graph.current.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      });

      angle += Math.PI / 300;

      if (distance > 500) {
        distance -= 1;
      }
    }, 10);
  }, []);

  return (
    <ForceGraph3D
      ref={graph}
      graphData={data}
      enableNodeDrag={false}
      enableNavigationControls={false}
      showNavInfo={false}
    />
  );
};

export default Graph;
