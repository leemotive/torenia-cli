import { Table } from 'torenia';

Table.config({
  apiPrefix: '/api',
  globalDataPreProcess: data => data.data
});
