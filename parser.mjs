export default class Parser {
  constructor() {
    this.commands = new Map([
      ['createTable', /^create table ([a-z]+)\s*\((.+)\)$/],
      ['insert', /^insert into ([a-z]+)\s*\((.+)\) values\s*\((.+)\)$/],
      ['select', /^select (.+) from ([a-z]+)(?: where (.+))?/],
      ['delete', /^delete from ([a-z]+)(?: where (.+))?$/]
    ]);
  }

  parse(statment) {
    for (let [command, regexp] of this.commands) {
      if (regexp.test(statment)) {
        return {
          command,
          parsedStatment: statment.match(regexp)
        }
      }
    }
    return false;
  }
}
