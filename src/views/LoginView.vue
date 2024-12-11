<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          @input="validateField('email')"
          required
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          @input="validateField('password')"
          required
        />
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      <button type="submit" class="btn-submit">Login</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/components/util/supabase"; // Adjust the path based on your project structure
import {
  emailValidator,
  requiredValidator,
  passwordValidator,
} from "@/components/util/validators"; // Adjust the path based on your project structure

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    validateField(field) {
      if (field === "email") {
        this.errors.email = emailValidator(this.form.email);
      }
      if (field === "password") {
        this.errors.password = passwordValidator(this.form.password);
      }
      if (!this.errors.email) {
        this.errors.email = requiredValidator(this.form.email);
      }
      if (!this.errors.password) {
        this.errors.password = requiredValidator(this.form.password);
      }
    },
    async login() {
      try {
        // Validate fields
        this.validateField("email");
        this.validateField("password");

        // If there are errors, stop the login process
        if (this.errors.email || this.errors.password) {
          alert("Please fix the validation errors.");
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

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}
</style>
