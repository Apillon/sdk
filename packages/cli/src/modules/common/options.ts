import { Option } from 'commander';

export const page = new Option('-p, --page <integer>', 'Page number');
export const limit = new Option('-l, --limit <integer>', 'Page limit');
export const orderBy = new Option('-o, --order-by <string>', 'Page order by');
export const descending = new Option(
  '-d --desc <string>',
  'Page order descending',
);
