const query = 'create table author (id number, name string, age number, city string, state string, country string)';
const regexp = /^create table ([a-z]+)\s*\((.+)\)$/;
const parsedQuery = query.match(regexp);

const tableName = parsedQuery[1];
const columns = parsedQuery[2].split(/,\s*/);

console.log(tableName);
console.log(columns);
