/*
 * Proportion of registered volunteers that are active
 *
 * For each Community business:
 * Proportion of total registered volunteers that are active in a given month,
 * where "active" means "have created at least one log"
 */
import * as Knex from 'knex';
import * as moment from 'moment';
import { uniq } from 'ramda';
import { getConfig } from '../../../config';
import { csv } from '../../writers';
import {
  CommunityBusiness,
  CommunityBusinesses,
  Volunteers,
  VolunteerLogs,
} from '../../../src/models';


const ignoreRe = new RegExp(
  [
    '(',
    [
      'Sonja\'s demo organisation',
      'Twine Community Center',
      'Power to Change',
      'Reason Digital',
      'Extra Workspace',
      'Extra workspace',
      'nerv',
      'trainer',
      'Edward',
      'Inspired Neighbourhoods CIC',
    ].join('|'),
    ')',
  ].join()
);

export default async () => {
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);
  const dates = dateRange();

  const cbs = (await CommunityBusinesses.get(client, { where: { deletedAt: null } }))
    .filter((cb) => !ignoreRe.test(cb.name) && !cb.name.includes('TEMPORARY') && cb.name !== 'as');

  const data = await Promise.all(cbs.map(async (cb) => {
    const signUp = await estimateSignUp(client, cb);
    const months = await dates.reduce(async (_acc, date) => {
      const acc = await _acc;
      acc[date.format('MMM YYYY')] = await cbVolsInMonthVol(client, date, cb);
      return acc;
    }, Promise.resolve({}) as Promise<{ [k: string]: number | string }>);

    return {
      ...months,
      name: cb.name,
      sector: cb.sector,
      region: cb.region,
      estimated_sign_up: signUp,
    };
  }));

  csv(
    ['name', 'sector', 'region', 'estimated_sign_up', ...dates.map((d) => d.format('MMM YYYY'))],
    data,
    'cbe_detail_prop_volunteers.csv'
  );

  return client.destroy();
};


const dateRange = () => {
  const from = moment('2017-01-01');
  const to = moment();
  const dates = [];
  const current = from.clone();

  while (current <= to) {
    dates.push(current.clone());
    current.add(1, 'month');
  }

  return dates;
};

const cbVolsInMonthVol = async (client: Knex, date: moment.Moment, cb: CommunityBusiness) => {
  const start = moment('2017-01-01').toDate();
  const since = date.startOf('month').toDate();
  const until = date.endOf('month').toDate();

  const vols = await Volunteers.fromCommunityBusiness(client, cb, {
    whereBetween: { createdAt: [start, until] },
  });
  const logs = await VolunteerLogs.fromCommunityBusiness(client, cb, { since, until });

  const activeUsers = uniq(logs.map((l) => l.userId));

  return vols.length > 0 ? activeUsers.length / vols.length : '';
};

const estimateSignUp = async (client: Knex, cb: CommunityBusiness) => {
  const logs = await VolunteerLogs.fromCommunityBusiness(client, cb, {
    order: ['startedAt', 'asc'],
    limit: 1,
  });
  return logs.length > 0 ? moment(logs[0].startedAt).format('MMM YYYY') : '';
};
