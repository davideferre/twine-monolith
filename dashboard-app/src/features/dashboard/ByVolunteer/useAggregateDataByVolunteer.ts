import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  logsToAggregatedData,
  AggregatedData,
  IdAndName
} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';
import Months from '../../../lib/util/months';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [months, setMonths] = useState<IdAndName[]>([]);

  const {
    loading,
    results: [logsData, volunteersData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: from, until: to },
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteers,
        transformResponse: [(res: any) => res.result.map(({ id, name }: IdAndName) =>
          ({ id, name }))],
      },
    ],
    updateOn: [...updateOn, from, to],
  });

  useEffect(() => {
    setMonths(
      [...Months.range(from, to, Months.format.verbose)]
        .map((month, i) => ({ id: i, name: month }))
    );
  }, [from, to]);

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const data = logsToAggregatedData({
      logs: logsData.data,
      tableType: tableType.MonthByName,
      xData: volunteersData.data,
      yData: months,
    });

    setAggregatedData(data);
  }, [error, loading, logsData, months, volunteersData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error, months };

  }
};
