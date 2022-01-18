export default class DatabaseError {
  constructor(statment, message) {
    this.statment = statment;
    this.message = message;
  }
};
