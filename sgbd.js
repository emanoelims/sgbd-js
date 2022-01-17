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
  }
};

const query = 'create table author (id number, name string, age number, city string, state string, country string)';

try {
  database.execute(query);
} catch (err) {
  console.log(err.message);
}
console.log(JSON.stringify(database, undefined, '  '));
