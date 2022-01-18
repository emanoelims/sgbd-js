import Parser from './parser.mjs';
import DatabaseError from './database-error.mjs';

export default class Database {
  constructor() {
    this.tables = {};
    this.parser = new Parser();
  }

  execute(statment) {
    const parsed = this.parser.parse(statment);
    if (!parsed) {
      const message = `Syntax error: '${statment}'`;
      throw new DatabaseError(statment, message);
    }
    const {command, parsedStatment} = parsed;
    return this[command](parsedStatment);
  }

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
  }

  insert(parsedStatment) {
    let [, tableName, columns, values] = parsedStatment;
    columns = columns.split(/,\s*/);
    values = values.split(/,\s*/);
    const row = {};
    columns.forEach((column, index) => {
      row[column] = values[index];
    });
    this.tables[tableName].data.push(row);
  }

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
  }

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
