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
    if (statment.startsWith('select')) {
      return this.select(statment);
    }
    if (statment.startsWith('delete')) {
      this.delete(statment);
      return;
    }

    const message = `Syntax error: '${statment}'`;
    throw new DatabaseError(statment, message);
  },
  createTable(query) {
    const regexp = /^create table ([a-z]+)\s*\((.+)\)$/;
    let [, tableName, columns] = query.match(regexp);
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
  },
  select(query) {
    const regexp = /^select (.+) from ([a-z]+)(?: where (.+))?/;
    let [, columns, tableName, where] = query.match(regexp);
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
  delete(query) {
    const regexp = /^delete from ([a-z]+)(?: where (.+))?$/;
    let [, tableName, where] = query.match(regexp);
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
