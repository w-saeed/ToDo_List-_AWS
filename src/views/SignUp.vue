
<template>
  <div class="about">
    <div id="app">
      <div id="nav">
        <router-link to="/">Log In </router-link> |

        <router-link to="/signup">Sign hello hdskakjkjdas Up</router-link>
      </div>

      <router-view />
    </div>

    <h1>Sign Up</h1>

    <br />

    <label>Email Address</label><br />

    <input v-model="email" />

    <br />

    <label>Username</label><br />

    <input v-model="userName" />

    <br />

    <label>Set Password</label><br />

    <input type="password" v-model="password" />

    <br />

    <label>Confirm Password</label><br />

    <input type="password" />

    <br />

    <br />

    <button class="btn btn-primary" @click="signup">Signup</button>
  </div>
</template>

<script>
export default {
  name: "signup",
  data() {
    return {
      userName: "",
      email: "",
      password: "",
    };
  },
  methods: {
    signup() {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.userName,
          email: this.email,
          password: this.password,
        }),
      };

      fetch(this.$store.state.serverUri + "register", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (response.ok) {
            console.log("register Success");
            this.$router.push({ name: "Home" });
          } else {
            // get error message from body or default to response status
            console.log("failed to register");
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });

      //this.$router.push({ name: "Home" });
    },
  },
};
</script>
