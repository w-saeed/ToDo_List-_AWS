
<template>
  <div class="about">
    <div id="app">
      <div id="nav">
        <router-link to="/">Log In </router-link> |

        <router-link to="/signup">Sign Up</router-link>
      </div>

      <router-view />
    </div>

    <h1>Sign Up</h1>

    <br />
    <form @submit.prevent="submit">
      <label>Email Address</label><br />

      <input type="email" v-model="email" required />

      <br />

      <label>Username</label><br />

      <input v-model="userName" required minlength="2" />

      <br />

      <label>Set Password</label><br />

      <input type="password" v-model="password" required minlength="6" />

      <br />

      <label>Confirm Password</label><br />

      <input type="password" v-model="confirmPassword" required minlength="6" />

      <br />
      <p v-show="errors">
        <b>Password is Wrong or less than 6 characters</b>
      </p>

      <br />
      <button class="button btn btn-primary" type="submit">Submit</button>
    </form>
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
      confirmPassword: "",
      errors: false,
    };
  },
  methods: {
    samePassword() {
      if (
        this.password == this.confirmPassword &&
        this.password != "" &&
        this.confirmPassword != ""
      ) {
        this.errors = false;
      } else {
        this.errors = true;
      }
    },
    submit() {
      this.samePassword();
      if (this.errors == false) {
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
      }
      if (this.errors == true) {
        this.errors = true;
      }
    },
  },
};
</script>
