
<template>
  <div class="about">
    <div id="app">
      <div id="nav">
        <router-link to="/">Log In </router-link> |

        <router-link to="/signup">Sign osjksdjkdsjkdsajkjkdss</router-link>
      </div>

      <router-view />
    </div>
    <h1>Log In</h1>
    <br />
    <p v-show="error">
      <b>Email or Password is Wrong </b>
    </p>
    <label>Email Address</label>
    <br />
    <input v-model="email" @focus="errorRemove()" />
    <br />
    <label>Password</label>
    <br />
    <input type="password" v-model="password" @focus="errorRemove()" />
    <br />
    <br />
    <button class="btn btn-primary" @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: false,
    };
  },
  methods: {
    errorRemove() {
      this.error = false;
    },
    login() {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      };

      fetch(this.$store.state.serverUri + "login", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (response.ok) {
            console.log("logged in succesfully");
            console.log(this.$store.commit("changeEmail", this.email));
            console.log(this.$store.commit("changeUsername", data.message));

            this.$router.push({ name: "Page" });
          } else {
            // get error message from body or default to response status
            console.log("failed to login");
            this.error = true;
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
  },
};
</script>
