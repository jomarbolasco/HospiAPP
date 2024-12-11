<template>
  <div class="register-container">
    <h1>Register Form</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="user_type">User Type:</label>
        <select id="user_type" v-model="form.user_type" @change="updateForm">
          <option value="" disabled selected>Select user type</option>
          <option value="patient">Patient</option>
          <option value="medical_staff">Medical Staff</option>
        </select>
      </div>

      <!-- Common Fields -->
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="form.name" required />
      </div>
      <div class="form-group">
        <label for="contact_information">Contact Information:</label>
        <input
          type="text"
          id="contact_information"
          v-model="form.contact_information"
          required
        />
      </div>

      <!-- Patient Fields -->
      <div v-if="form.user_type === 'patient'">
        <div class="form-group">
          <label for="age">Age:</label>
          <input type="number" id="age" v-model="form.age" required />
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="form.gender" required>
            <option value="" disabled selected>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <!-- Medical Staff Fields -->
      <div v-if="form.user_type === 'medical_staff'">
        <div class="form-group">
          <label for="specialty">Specialty:</label>
          <input type="text" id="specialty" v-model="form.specialty" required />
        </div>
      </div>

      <button type="submit" class="btn-submit">Register</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/components/util/supabase"; // Adjust the path based on your project structure

export default {
  data() {
    return {
      form: {
        user_type: "",
        name: "",
        contact_information: "",
        age: "",
        gender: "",
        specialty: "",
      },
    };
  },
  methods: {
    async register() {
      let tableName =
        this.form.user_type === "patient" ? "patients" : "medicalstaff";
      const { data, error } = await supabase
        .from(tableName)
        .insert([this.form]);

      if (error) {
        console.error("Error registering:", error);
      } else {
        console.log("Registered successfully:", data);
        // Reset the form or handle success accordingly
      }
    },
    updateForm() {
      this.form.age = "";
      this.form.gender = "";
      this.form.specialty = "";
    },
  },
};
</script>

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
