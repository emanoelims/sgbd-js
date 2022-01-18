const DatabaseError = function (statment, message) {
  this.statment = statment;
  this.message = message;
};

const Parser = function () {
  this.commands = new Map([
    ['createTable', /^create table ([a-z]+)\s*\((.+)\)$/],
    ['insert', /^insert into ([a-z]+)\s*\((.+)\) values\s*\((.+)\)$/],
    ['select', /^select (.+) from ([a-z]+)(?: where (.+))?/],
    ['delete', /^delete from ([a-z]+)(?: where (.+))?$/]
  ]);
  this.parse = (statment) => {
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

const database = {
  tables: {},
  parser: new Parser(),
  execute(statment) {
    const parsed = this.parser.parse(statment);
    if (!parsed) {
      const message = `Syntax error: '${statment}'`;
      throw new DatabaseError(statment, message);
    }
    const {command, parsedStatment} = parsed;
    return this[command](parsedStatment);
  },
  createTable(parsedStatment) {
    let [, tableName, columns] = parsedStatment;
    columns = columns.split(/,\s*/);

    this.tables[tableName] = {
      columns: {},
      data: []
    }

    for (let column of columns) {
      const [name, type] = column.split(' ');
      this.tables[tableName].columns[name] = type;
    }
  },
  insert(parsedStatment) {
    let [, tableName, columns, values] = parsedStatment;
    columns = columns.split(/,\s*/);
    values = values.split(/,\s*/);

    const row = {};

    columns.forEach((column, index) => {
      row[column] = values[index];
    })

    this.tables[tableName].data.push(row);
  },
  select(parsedStatment) {
    let [, columns, tableName, where] = parsedStatment; 
    columns = columns.split(/,\s*/);
    let data;
    if (where) {
      const [columnWhere, valueWhere] = where.split(/\s*=\s*/);
      data = this.tables[tableName].data.filter((row) => {
        return row[columnWhere] === valueWhere;
      });
    }

    data = data || this.tables[tableName].data;

    return data.map((row) => {
      const newRow = {};
      columns.forEach(column => {
        newRow[column] = row[column];
      });
      return newRow;
    });
  },
  delete(parsedStatment) {
    let [, tableName, where] = parsedStatment;
    if (where) {
      const [columnWhere, valueWhere] = where.split(/\s*=\s*/);
      this.tables[tableName].data = this.tables[tableName].data.filter((row) => {
        return row[columnWhere] !== valueWhere;
      });
      return;
    }

    this.tables[tableName].data = [];
  }
};

try {
  database.execute('create table author (id number, name string, age number, city string, state string, country string)');
  console.log(JSON.stringify(database, undefined, '  '))
  database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
  database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
  database.execute("insert into author (id, name, age) values (3, Martin Fowler, 62)");
  console.log(database.execute("select name, age from author"));
  database.execute("delete from author where id = 2");
  console.log(database.execute("select name, age from author"));
  database.execute("delete from author");
  console.log(database.execute("select name, age from author"));
} catch (err) {
  console.log(err.message);
}
