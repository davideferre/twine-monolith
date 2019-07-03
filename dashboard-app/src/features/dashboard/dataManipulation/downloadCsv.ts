import moment from 'moment';
import { aggregatedToCsv } from './aggregatedToCsv';
import Months from '../../../lib/util/months';
import { saveAs } from 'file-saver';
import { AggregatedData, isDataEmpty } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';


interface Params {
  fileName: string;
  data: AggregatedData;
  fromDate: Date;
  toDate: Date;
  unit: DurationUnitEnum;
  sortBy: number;
}

// tslint:disable-next-line: max-line-length
export const downloadCsv = async ({ data: aggData, fromDate, toDate, fileName, unit, sortBy }: Params) => {
  if (isDataEmpty(aggData)) {
    throw new Error('No data available to download');
  }

  try {
    const csv = await aggregatedToCsv(aggData, unit, sortBy);
    const from = moment(fromDate).format(Months.format.filename);
    const to = moment(toDate).format(Months.format.filename);
    const file = new File([csv], `${fileName}_${from}-${to}.csv`, {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(file);

  } catch (error) {
    throw new Error('There was a problem downloading your data');

  }
};
