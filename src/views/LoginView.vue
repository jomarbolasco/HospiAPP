<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
      <button type="submit" class="btn-submit">Login</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/components/util/supabase"; // Adjust the path based on your project structure

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        // Validate email format
        if (!this.form.email || !/\S+@\S+\.\S+/.test(this.form.email)) {
          alert("Please enter a valid email address.");
          return;
        }

        // Attempt to log in the user using email and password
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: this.form.email,
          password: this.form.password,
        });

        // Log the response for debugging purposes
        console.log("Login Response:", { loginError });

        // If there is a login error, throw an exception
        if (loginError) {
          console.error("Login Error:", loginError);
          throw new Error(`Login failed: ${loginError.message}`);
        }

        // If login is successful, navigate to the desired route
        // For example, redirect to the dashboard
        this.$router.push({ name: "Dashboard" });

        // Optionally, handle success accordingly
        console.log("Logged in successfully!");
      } catch (error) {
        console.error("Error during login:", error.message);
        alert("Login failed: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.btn-submit {
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #0056b3;
}
</style>
