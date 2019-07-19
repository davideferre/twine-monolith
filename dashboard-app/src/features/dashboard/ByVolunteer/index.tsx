import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../components/UtilityBar';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { H1 } from '../../../lib/ui/components/Headings';
import { DurationUnitEnum } from '../../../types';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import VolunteerTabs from './VolunteerTabs';
import Errors from '../components/Errors';
import useAggregateDataByVolunteer from './useAggregateDataByVolunteer';
import { getTitleForMonthPicker } from '../util';
import { LegendData } from '../components/StackedBarChart/types';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';


/**
 * Styles
 */
const Container = styled(Grid)`
`;


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };

/**
 * Component
 */
const ByVolunteer: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [legendData, setLegendData] = useState<LegendData>([]);
  const { loading, data, error, months } =
    useAggregateDataByVolunteer({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // get sorting state values
  const {
    orderable,
    onChangeOrderable,
  } = useOrderable({ initialOrderable: { sortByIndex: 1, order: 'desc' }, updateOn: [tableData] });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData, orderable]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && months) {
      setTableData(aggregatedToTableData({ data, unit, yData: months }));
    }
  }, [data, unit]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'volunteer', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, unit, orderable]);

  const tabProps = {
    data,
    unit,
    tableData,
    orderable,
    onChangeSortBy,
    title: getTitleForMonthPicker(TitlesCopy.Volunteers.subtitle, fromDate, toDate),
    legendData,
    setLegendData,
  };

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Volunteers.title}</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
          <UtilityBar
            dateFilter="month"
            datePickerConstraint={DatePickerConstraints}
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      <Errors errors={errors}/>
      {
        loading
          ? <FullScreenBeatLoader color={ColoursEnum.purple}/>
          : <VolunteerTabs {...tabProps}/>
      }
    </Container>
  );
};

export default withRouter(ByVolunteer);

