const DatabaseError = function (statment, message) {
  this.statment = statment;
  this.message = message;
};

const database = {
  tables: {},
  execute(statment) {
    if (statment.startsWith('create table')) {
      this.createTable(statment);
      return;
    }

    if (statment.startsWith('insert into')) {
      this.insert(statment);
      return;
    }

    const message = `Syntax error: '${statment}'`;
    throw new DatabaseError(statment, message);
  },
  createTable(query) {
    const regexp = /^create table ([a-z]+)\s*\((.+)\)$/;
    let [, tableName, columnsQuery] = query.match(regexp);
    columnsQuery = columnsQuery.split(/,\s*/);

    this.tables[tableName] = {
      columns: {},
      data: []
    }

    for (let columnQuery of columnsQuery) {
      const [name, type] = columnQuery.split(' ');
      this.tables[tableName].columns[name] = type;
    }
  },
  insert(query) {
    const regexp = /^insert into ([a-z]+)\s*\((.+)\) values\s*\((.+)\)$/;
    let [, tableName, columns, values] = query.match(regexp);
    columns = columns.split(/,\s*/);
    values = values.split(/,\s*/);

    const row = {};

    columns.forEach((column, index) => {
      row[column] = values[index];
    })

    this.tables[tableName].data.push(row);
  }
};

try {
  database.execute('create table author (id number, name string, age number, city string, state string, country string)');
  database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
  database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
  database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
} catch (err) {
  console.log(err.message);
}
console.log(JSON.stringify(database, undefined, '  '));
