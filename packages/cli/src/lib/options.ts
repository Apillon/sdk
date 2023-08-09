import { Command, Option } from 'commander';

export function addPaginationOptions(command: Command) {
  return command
    .addOption(new Option('-p, --page <integer>', 'Page number'))
    .addOption(new Option('-l, --limit <integer>', 'Page limit'))
    .addOption(new Option('-o, --order-by <string>', 'Page order by'))
    .addOption(new Option('-d --desc <string>', 'Page order descending'));
}
