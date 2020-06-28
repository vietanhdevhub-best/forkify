import axios from 'axios';
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async fetchData() {
    try {
      const { data } = await axios.get(
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
      );
      this.result = data.recipes;
    } catch (error) {
      alert('Sorry we do not support that food yet!!!');
    }
  }
}
