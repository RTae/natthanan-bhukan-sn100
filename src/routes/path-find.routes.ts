import { Router } from 'express';
import { body } from 'express-validator';
import { EPoint } from 'src/types/path-find.types';
import { drone } from 'src/utils/constants';
import { getPaths } from 'src/utils/path-find.helpers';
import { validate } from 'src/utils/validation';
import { graph } from 'src/utils';

const router = Router();

router.get('/', (_, res) => {
  res.send(
    `After figuring out the correct landing zone, ${drone} needs to figure out the shortest path to get there.

It is guided by satellite S1, telling it the different paths it can take to the landing zone and the distance between each.

Currently, the API doesn't finish and overloads the server. We're cheap, so we don't want to allocate bigger resources for this.

So your task is to update the API to correctly return the shortest path between the starting and ending coordinates provided.

The API accepts a start and end value, with both being values that represent a valid point on the map (A, B, C,... F).
It should then return the shortest path between the start and end points in the form of an array that represents the order of the path that ${drone} should take and the total distance.`,
  );
});

router.post(
  '/',
  validate(
    body(['start', 'end'], 'Not a valid point').isIn(Object.values(EPoint)),
  ),
  async (req, res) => {
    const { start, end } = req.body;
    const paths = await getPaths();
    const result = graph.findShortestPath(paths, start, end);

    if (result.distance >= 0) return res.status(200).send(result);

    return res.status(400).send(result);
  },
);

export default router;
