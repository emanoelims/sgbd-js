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
    const parsedQuery = query.match(regexp);
    const tableName = parsedQuery[1];
    const columnsQuery = parsedQuery[2].split(/,\s*/);

    this.tables[tableName] = {
      columns: {},
      data: []
    }

    for (let columnQuery of columnsQuery) {
      const column = columnQuery.split(' ');
      const name = column[0];
      const type = column[1];
      this.tables[tableName].columns[name] = type;
    }
  },
  insert(query) {
    const regexp = /^insert into ([a-z]+)\s*\((.+)\) values\s*\((.+)\)$/;
    const parsedQuery = query.match(regexp);
    const tableName = parsedQuery[1];
    const columns = parsedQuery[2].split(/,\s*/);
    const values = parsedQuery[3].split(/,\s*/);

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
