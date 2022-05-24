// Copyright 2021 The StackStorm Authors.
// Copyright 2020 Extreme Networks, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Vector from '../vector';
import { ORBIT_DISTANCE } from '../const';

export type Direction = 'up' | 'down' | 'left' | 'right';
export class Line {
  px: number;
  direction: Direction;
  constructor(px: number, dir: Direction) {
    Object.defineProperties(this, {
      direction: {
        value: dir,
      },
      px: {
        value: px,
      },
    });
  }
  calcNewPosition(origin: Vector): Vector {
    const point = new Vector(origin.x, origin.y);
    switch(this.direction) {
      case 'up':
        point.y -= this.px;
        break;
      case 'down':
        point.y += this.px;
        break;
      case 'left':
        point.x -= this.px;
        break;
      case 'right':
        point.x += this.px;
        break;
    }
    return point;
  }
  toPathString(origin: Vector, next: Line): string {
    const newPoint = this.calcNewPosition(origin);

    // does the next line segment curve out?
    const adjustmentNext = next && next.direction !== this.direction ? ORBIT_DISTANCE : 0;
    // does this line go up and down?  or left and right?
    const isYDimension = this.direction === 'up' || this.direction === 'down';
    // Which direction in pixels from 0,0?
    const dimensionScale = this.direction === 'up' || this.direction === 'left' ? -1 : 1;

    let curvePath = '';

    if(adjustmentNext) {
      const adjustmentMax = Math.min(adjustmentNext, next.px / 2, this.px / 2);
      const nextIsYDimension = next.direction === 'up' || next.direction === 'down';
      const nextDimensionScale = next.direction === 'up' || next.direction === 'left' ? -1 : 1;

      if(isYDimension && !nextIsYDimension) {
        const oldPointY = newPoint.y;
        newPoint.y -= adjustmentMax * dimensionScale;
        const controlPointX = newPoint.x + adjustmentMax * nextDimensionScale;
        curvePath = ` Q ${newPoint.x} ${oldPointY}, ${controlPointX} ${oldPointY}`;
      }
      else if(nextIsYDimension) {
        const oldPointX = newPoint.x;
        const controlPointY = newPoint.y + adjustmentMax * nextDimensionScale;
        newPoint.x -= adjustmentMax * dimensionScale;
        curvePath = ` Q ${oldPointX} ${newPoint.y}, ${oldPointX} ${controlPointY}`;
      }
    }

    return `L ${newPoint.x} ${newPoint.y}${curvePath}`;
  }
  toString(): string {
    return `${this.px} ${this.direction}`;
  }
}

export default Line;
