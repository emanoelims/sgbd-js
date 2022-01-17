const database = {
  tables: {},
  execute(statment) {
    if (statment.startsWith('create table')) {
      this.createTable(statment);
    }
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
database.execute(query);
console.log(JSON.stringify(database, undefined, '  '));
