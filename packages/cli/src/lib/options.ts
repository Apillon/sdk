import { Command, Option } from 'commander';
import { GlobalOptions } from './types';
import { IApillonPagination } from '@apillon/sdk';

export function addPaginationOptions(command: Command) {
  return command
    .addOption(
      new Option(
        '-s, --search <string>',
        'Search by name or other object identifier',
      ),
    )
    .addOption(new Option('-p, --page <integer>', 'Page number'))
    .addOption(new Option('-l, --limit <integer>', 'Page limit'))
    .addOption(new Option('-o, --order-by <string>', 'Page order by'))
    .addOption(new Option('-d --desc <boolean>', 'Page order descending'));
}

export function paginate(opts: GlobalOptions): IApillonPagination {
  return {
    search: opts.search,
    page: +opts.page,
    limit: +opts.limit,
    orderBy: opts.orderBy,
    desc: !!opts.desc,
  };
}
