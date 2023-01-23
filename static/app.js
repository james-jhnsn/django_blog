Vue.component("create", {
  data: function () {
    return {
      create: false,
    };
  },
  template: `
  <a class="nav-link text-decoration-none text-capitalize" role="button">+ New Post</a>`,
  methods: {
    createPost: function () {
      axios({
        method: "post",
        url: "/api/v1/posts/",
        headers: {
          "X-CSRFToken": this.csrfToken,
        },
        data: {
          title: this.newPost.title,
          author: this.currentUser.id,
          body: this.newPost.body,
        },
      })
        .then((response) => {
          this.loadPosts();
          // this.create = false;
          this.newPost = {
            title: "",
            author: null,
            body: "",
          };
          this.postErrors = {};
        })
        .catch((error) => (this.postErrors = error.response.data));
    },
  },
});

Vue.component("navbar", {
  data: function () {
    return {};
  },
  template: `
  <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
    <a class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      <img src="/static/images/icons8-osprey-50.png" alt="">
    </a>
    <ul class="nav my-auto">
      {% if user.is_authenticated %}
      <a class="nav-link text-decoration-none text-capitalize px-0">Welcome, {{user.username}}!</a>
      <create></create>
      <!-- <a class="nav-link text-decoration-none text-capitalize" role="button"  @click='create=true'>+ New Post</a> -->
      <a class="nav-link text-decoration-none text-u" href="{% url 'logout' %}">Logout</a>
      {% else %}
      <li class="nav-item"><a href="{% url 'login' %}" class="nav-link">Login</a></li>
      <li class="nav-item"><a href="{% url 'users:signup' %}" class="nav-link">Signup</a></li>
      {% endif %}
    </ul>
</header>`,
});

const vm = new Vue({
  el: "#app",
  delimiters: ["[[", "]]"],
  data: {
    csrfToken: "",
    posts: [],
    users: [],
    detail: [],
    currentUser: {},
    // create: false,
    edit: false,
    newPost: {
      title: "",
      author: null,
      body: "",
    },
    postErrors: {},
  },
  filters: {
    formatTime: function (value) {
      let time = value.split(/[T]/)[0].split("-");
      return `${time[0]}/${time[1]}/${time[2]}`;
    },
  },

  methods: {
    loadPosts: function () {
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
    loadUsers: function () {
      axios({
        method: "get",
        url: "api/v1/users/",
      }).then((response) => (this.users = response.data));
    },
    loadCurrentUser: function () {
      axios({
        method: "get",
        url: "/api/v1/current-user/",
      }).then((response) => (this.currentUser = response.data));
    },
    // createPost: function () {
    //   axios({
    //     method: "post",
    //     url: "/api/v1/posts/",
    //     headers: {
    //       "X-CSRFToken": this.csrfToken,
    //     },
    //     data: {
    //       title: this.newPost.title,
    //       author: this.currentUser.id,
    //       body: this.newPost.body,
    //     },
    //   })
    //     .then((response) => {
    //       this.loadPosts();
    //       this.create = false;
    //       this.newPost = {
    //         title: "",
    //         author: null,
    //         body: "",
    //       };
    //       this.postErrors = {};
    //     })
    //     .catch((error) => (this.postErrors = error.response.data));
    // },
    editPost: function (post) {
      axios({
        method: "patch",
        url: "/api/v1/posts/",
        headers: {
          "X-CSRFToken": this.csrfToken,
        },
        data: {
          title: this.newPost.title,
          author: this.currentUser.id,
          body: this.newPost.body,
        },
      })
        .then((response) => {
          this.loadPosts();
          this.create = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created: function () {
    this.loadPosts();
    this.loadUsers();
    this.loadCurrentUser();
  },
  mounted: function () {
    this.csrfToken = document.querySelector(
      "input[name=csrfmiddlewaretoken]"
    ).value;
  },
});
