const vm = new Vue({
  el: "#app",
  delimiters: ["[[", "]]"],
  data: {
    csrfToken: "",
    posts: [],
    detail: [],
    currentUser: {},
  },

  methods: {
    loadPosts: function() {
      axios({
        method: "get",
        url: "api/v1/posts",
      })
        .then((response) => {
          this.posts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted: function() {
    this.csrfToken = document.querySelector(
      "input[name=csrfmiddlewaretoken]"
    ).value;
  },
  created: function() {
    this.loadPosts();
  },
});
