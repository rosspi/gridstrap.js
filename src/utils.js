export default {
  generateRandomId: function () {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  }
}