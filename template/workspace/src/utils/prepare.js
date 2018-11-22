import { Table } from 'torenia';
import 'utils/dictionary';

Table.config({
  apiPrefix: '/api',
  globalDataPreProcess: data => data.data
});



