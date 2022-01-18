import Database from './database.mjs';

const database = new Database();

try {
  database.execute('create table author (id number, name string, age number, city string, state string, country string)');
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
