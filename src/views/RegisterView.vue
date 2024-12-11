<script>
import { supabase } from "@/components/util/supabase"; // Adjust the path based on your project structure
import {
  isEmpty,
  requiredValidator,
  emailValidator,
  passwordValidator,
  integerValidator,
} from "@/components/util/validators"; // Adjust the path based on your project structure

export default {
  data() {
    return {
      form: {
        user_type: "patient", // Default to patient
        email: "",
        password: "",
        name: "",
        contact_information: "",
        age: "",
        gender: "",
        specialty_id: "",
      },
      errors: {},
      specialties: [],
    };
  },
  created() {
    this.fetchSpecialties();
  },
  methods: {
    // Fetch specialties from the database for medical staff
    async fetchSpecialties() {
      const { data, error } = await supabase.from("specialties").select("*");
      if (error) {
        console.error("Error fetching specialties:", error);
      } else {
        this.specialties = data;
      }
    },

    // Handle the user registration process
    async register() {
      this.errors = {};

      // Validate all fields before submission
      this.validateField("email");
      this.validateField("password");
      this.validateField("name");
      this.validateField("contact_information");
      if (this.form.user_type === "patient") {
        this.validateField("age");
        this.validateField("gender");
      } else {
        this.validateField("specialty_id");
      }

      // If there are any errors, do not proceed with the submission
      if (Object.keys(this.errors).length > 0) {
        return;
      }

      try {
        // Attempt to sign up the user using email and password
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: this.form.email,
            password: this.form.password,
          });

        // Log the response for debugging purposes
        console.log("SignUp Response:", { signUpData, signUpError });

        // If there is a sign-up error, throw an exception
        if (signUpError) {
          console.error("SignUp Error:", signUpError);
          throw new Error(`Sign up failed: ${signUpError.message}`);
        }

        // If no user is returned, throw an error
        const user = signUpData.user; // Adjusting based on the current response structure
        if (!user) {
          console.error("No user returned during sign-up");
          throw new Error("Sign up failed, no user returned.");
        }

        // Prepare the payload to insert into the corresponding table (patients or medicalstaff)
        let payload;
        let tableName;

        if (this.form.user_type === "patient") {
          payload = {
            user_id: user.id, // Link to the authenticated user
            name: this.form.name,
            contact_information: this.form.contact_information,
            age: this.form.age,
            gender: this.form.gender,
          };
          tableName = "patients";
        } else if (this.form.user_type === "medical_staff") {
          payload = {
            name: this.form.name,
            contact_information: this.form.contact_information,
            specialty_id: this.form.specialty_id, // Use specialty_id for medical staff
          };
          tableName = "medicalstaff";
        }

        // Log the payload being inserted for debugging purposes
        console.log("Payload:", payload);

        // Insert the payload into the corresponding table
        const { data, error } = await supabase
          .from(tableName)
          .insert([payload]);

        // Handle insert errors
        if (error) {
          console.error("Error registering:", error);
          throw new Error(error.message);
        } else {
          console.log("Registered successfully:", data);
          // Reset the form or handle success accordingly
        }
      } catch (error) {
        console.error("Error during registration:", error.message);
        alert("Registration failed: " + error.message);
      }
    },

    // Clear certain fields based on user type selection
    updateForm() {
      this.form.age = "";
      this.form.gender = "";
      this.form.specialty_id = "";
    },

    // Validate individual fields
    validateField(field) {
      switch (field) {
        case "email":
          this.errors.email = emailValidator(this.form.email) || "";
          break;
        case "password":
          this.errors.password = passwordValidator(this.form.password) || "";
          break;
        case "name":
          this.errors.name = requiredValidator(this.form.name) || "";
          break;
        case "contact_information":
          this.errors.contact_information =
            requiredValidator(this.form.contact_information) || "";
          break;
        case "age":
          this.errors.age =
            requiredValidator(this.form.age) ||
            integerValidator(this.form.age) ||
            "";
          break;
        case "gender":
          this.errors.gender = requiredValidator(this.form.gender) || "";
          break;
        case "specialty_id":
          this.errors.specialty_id =
            requiredValidator(this.form.specialty_id) || "";
          break;
        default:
          break;
      }
    },
  },
};
</script>
<template>
  <div class="register-container">
    <h1>Register Form</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="user_type">User Type:</label>
        <select id="user_type" v-model="form.user_type" @change="updateForm">
          <option value="patient">Patient</option>
          <option value="medical_staff">Medical Staff</option>
        </select>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          @input="validateField('email')"
        />
        <span v-if="errors.email">{{ errors.email }}</span>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          required
          @input="validateField('password')"
        />
        <span v-if="errors.password">{{ errors.password }}</span>
      </div>

      <!-- Patient Fields (Default) -->
      <div v-if="form.user_type === 'patient'">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            @input="validateField('name')"
          />
          <span v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="contact_information">Contact Information:</label>
          <input
            type="text"
            id="contact_information"
            v-model="form.contact_information"
            required
            @input="validateField('contact_information')"
          />
          <span v-if="errors.contact_information">{{
            errors.contact_information
          }}</span>
        </div>
        <div class="form-group">
          <label for="age">Age:</label>
          <input
            type="number"
            id="age"
            v-model="form.age"
            required
            @input="validateField('age')"
          />
          <span v-if="errors.age">{{ errors.age }}</span>
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <select
            id="gender"
            v-model="form.gender"
            required
            @change="validateField('gender')"
          >
            <option value="" disabled selected>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          <span v-if="errors.gender">{{ errors.gender }}</span>
        </div>
      </div>

      <!-- Medical Staff Fields -->
      <div v-if="form.user_type === 'medical_staff'">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            @input="validateField('name')"
          />
          <span v-if="errors.name">{{ errors.name }}</span>
        </div>
        <div class="form-group">
          <label for="contact_information">Contact Information:</label>
          <input
            type="text"
            id="contact_information"
            v-model="form.contact_information"
            required
            @input="validateField('contact_information')"
          />
          <span v-if="errors.contact_information">{{
            errors.contact_information
          }}</span>
        </div>
        <div class="form-group">
          <label for="specialty_id">Specialty:</label>
          <select
            id="specialty_id"
            v-model="form.specialty_id"
            required
            @change="validateField('specialty_id')"
          >
            <option value="" disabled selected>Select specialty</option>
            <option
              v-for="specialty in specialties"
              :key="specialty.id"
              :value="specialty.id"
            >
              {{ specialty.name }}
            </option>
          </select>
          <span v-if="errors.specialty_id">{{ errors.specialty_id }}</span>
        </div>
      </div>

      <button type="submit" class="btn-submit">Register</button>
    </form>
  </div>
</template>
<style scoped>
.register-container {
  max-width: 600px;
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

.register-form {
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

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

input:focus,
select:focus {
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
