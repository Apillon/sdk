import { Command, Option } from 'commander';
import { GlobalOptions } from './types';
import { IApillonPagination, toBoolean, toInteger } from '@apillon/sdk';

export function addPaginationOptions(command: Command) {
  return command
    .addOption(
      new Option(
        '--search <string>',
        'Search by name or other object identifier',
      ),
    )
    .addOption(new Option('--page <integer>', 'Page number').default(1))
    .addOption(
      new Option('--limit <integer>', 'Page limit (page size)').default(20),
    )
    .addOption(new Option('--order-by <string>', 'Page order by any property'))
    .addOption(new Option('--desc <boolean>', 'Page order descending'));
}

export function paginate(opts: GlobalOptions): IApillonPagination {
  return {
    search: opts.search,
    page: toInteger(opts.page),
    limit: toInteger(opts.limit),
    orderBy: opts.orderBy,
    desc: toBoolean(opts.desc),
  };
}
