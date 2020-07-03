import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }
  addItems(count, unit, ingredient) {
    const item = {
      count,
      unit,
      ingredient,
      id: uniqid(),
    };
    this.items.push(item);
    return item;
  }
  deleteItems(id) {
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }
  updateCount(id, newCount) {
    const item = this.items.find((item) => item.id === id);
    item.count = newCount;
  }
}
