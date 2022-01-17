const query = 'create table author (id number, name string, age number, city string, state string, country string)';
const regexp = /^create table ([a-z]+)\s*\((.+)\)$/;
const parsedQuery = query.match(regexp);
const tableName = parsedQuery[1];
const columnsQuery = parsedQuery[2].split(/,\s*/);

const database = {
  tables: {
    [tableName]: {
      columns: {}
    }
  }
};

for (let columnQuery of columnsQuery) {
  const column = columnQuery.split(' ');
  const name = column[0];
  const type = column[1];
  database.tables[tableName].columns[name] = type;
}

console.log(JSON.stringify(database, undefined, '  '));
