<template>
  <div>
    <h1>Book an Appointment</h1>
    <form @submit.prevent="bookAppointment">
      <label for="patient_name">Patient Name:</label>
      <input
        type="text"
        v-model="patientName"
        @blur="validateField('patientName')"
      />
      <span v-if="errors.patientName">{{ errors.patientName }}</span>

      <label for="relation_type">Relation Type:</label>
      <input
        type="text"
        v-model="relationType"
        @blur="validateField('relationType')"
      />
      <span v-if="errors.relationType">{{ errors.relationType }}</span>

      <label for="appointment_date">Appointment Date:</label>
      <input
        type="date"
        v-model="appointmentDate"
        @blur="validateField('appointmentDate')"
      />
      <span v-if="errors.appointmentDate">{{ errors.appointmentDate }}</span>

      <label for="appointment_time">Appointment Time:</label>
      <input
        type="time"
        v-model="appointmentTime"
        @blur="validateField('appointmentTime')"
      />
      <span v-if="errors.appointmentTime">{{ errors.appointmentTime }}</span>

      <label for="illness_description">Illness Description:</label>
      <textarea
        v-model="illnessDescription"
        @blur="validateField('illnessDescription')"
      ></textarea>
      <span v-if="errors.illnessDescription">{{
        errors.illnessDescription
      }}</span>

      <label for="specialty_id">Specialty:</label>
      <select v-model="specialtyId" @blur="validateField('specialtyId')">
        <option
          v-for="specialty in specialties"
          :key="specialty.id"
          :value="specialty.id"
        >
          {{ specialty.name }}
        </option>
      </select>
      <span v-if="errors.specialtyId">{{ errors.specialtyId }}</span>

      <button type="submit">Book Appointment</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "";
import { requiredValidator } from "";

export default {
  data() {
    return {
      patientName: "",
      relationType: "",
      appointmentDate: "",
      appointmentTime: "",
      illnessDescription: "",
      specialtyId: "",
      specialties: [],
      errors: {},
    };
  },
  async mounted() {
    const { data: specialties } = await supabase
      .from("specialties")
      .select("*");
    this.specialties = specialties;
  },
  methods: {
    validateField(field) {
      switch (field) {
        case "patientName":
          this.errors.patientName = requiredValidator(this.patientName);
          break;
        case "relationType":
          this.errors.relationType = requiredValidator(this.relationType);
          break;
        case "appointmentDate":
          this.errors.appointmentDate = requiredValidator(this.appointmentDate);
          break;
        case "appointmentTime":
          this.errors.appointmentTime = requiredValidator(this.appointmentTime);
          break;
        case "illnessDescription":
          this.errors.illnessDescription = requiredValidator(
            this.illnessDescription
          );
          break;
        case "specialtyId":
          this.errors.specialtyId = requiredValidator(this.specialtyId);
          break;
      }
    },
    async bookAppointment() {
      this.validateField("patientName");
      this.validateField("relationType");
      this.validateField("appointmentDate");
      this.validateField("appointmentTime");
      this.validateField("illnessDescription");
      this.validateField("specialtyId");

      if (
        !this.errors.patientName &&
        !this.errors.relationType &&
        !this.errors.appointmentDate &&
        !this.errors.appointmentTime &&
        !this.errors.illnessDescription &&
        !this.errors.specialtyId
      ) {
        const { user } = supabase.auth.user();
        const { data: patients, error: patientError } = await supabase
          .from("patients")
          .insert({
            user_id: user.id,
            name: this.patientName,
            // other patient details...
          });

        if (patientError) {
          alert(patientError.message);
          return;
        }

        const patient = patients[0];
        const { error } = await supabase.from("appointments").insert({
          user_id: user.id,
          patient_id: patient.id,
          relation_type: this.relationType,
          appointment_date: this.appointmentDate,
          appointment_time: this.appointmentTime,
          illness_description: this.illnessDescription,
          specialty_id: this.specialtyId,
        });

        if (error) {
          alert(error.message);
        } else {
          alert("Appointment booked successfully!");
        }
      }
    },
  },
};
</script>
