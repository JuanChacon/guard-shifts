<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Horarios
      </h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">
       Modulo para agendar horas por servicio y semana
      </p>
    </div>

    <h3>Selecciona</h3>
    <div class="grid grid-cols-3 gap-y-4">

    

      <div class="col-span-3">
        <select class="px-4 py-3" v-model="serviceId">
          <option v-for="svce in services" :key="svce.id" :value="svce.id">{{svce.name}}</option>
        </select>     
      </div>

        <div class="col-span-3">
          <select class="px-4 py-3" @change="schedulesByServiceAndWeekNo($event)">
            <option value= ""></option> 
          <option v-for="week in weeks" :key="week.weekNo" :value="week.weekNo">{{week.text}}</option>
        </select>
      </div>

      <div v-if="week">
          <h4>del {{`${week}`}}</h4>
      </div>

      


  
    </div>

  <div class="grid grid-cols-3 gap-x-4">

  <div class="flex flex-col"  v-for="schedule in schedules" :key="schedule.key">
        <div  v-for="data in schedule" :key="data.key">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full border-solid border-2 border-black">
                  <thead class="border-b">
                    <tr>
                      <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left" style="background-color:yellow">
                        {{data.title}}
                      </th>
                      <th v-for="employee in employees" :key="employee.id" scope="col" :style="{backgroundColor:employee.color}" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        {{employee.name}}
                      </th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b" v-for="date in data.dates" :key="date.hour">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" :id="date.id">
                        {{date.schedule_hours}}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" v-for="employee in employees" :key="employee.id">
                        <input type="checkbox" class="indeterminate:bg-gray-300 " :key="employee.id" :id="`${employee.id}_${date.id}`"/>
                      </td>
                    </tr>
            
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
    
  </div>
  </div>

</template>


<script>

import axios from 'axios';
// import {Menu,  MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
// import { ChevronDownIcon } from '@heroicons/vue/solid'

export default {

  name: 'shceduler',
  components: {
   
  },
  serviceId: null,
  headers: { "Content-Type": "application/json" },
  data() {

  
   
    const schedulesByServiceAndWeekNo = ({target: {value} })=>{
      console.log(value);
      const headers = this.headers;
      const serviceId = this.serviceId;
      console.log(this.serviceId,serviceId);
      axios.get(`http://localhost:3000/api/services/${serviceId}/${value}/schedules`, { headers })
      .then(response => { 
      this.schedules = response.data.schedules;
      this.week = `${response.data.week}`;
      });
    }
    return {
      name,
      serviceId: null,
      week: "",
      employees: [],
      services: [],
      schedules: [],
      weeks: [],
      schedulesByServiceAndWeekNo
    };
  },
  created() {
    // GET request using axios with set headers
    const headers = this.headers;
    axios.get("http://localhost:3000/api/employees", { headers })
      .then(response => {
        this.employees = response.data.map(employee => {return {...employee,color:`#${employee.id}9464${employee.id}`}})
        });

      axios.get("http://localhost:3000/api/services", { headers })
      .then(response => this.services = response.data);

       axios.get("http://localhost:3000/api/catalogs/weeks", { headers })
      .then(response => this.weeks = response.data.dates);
  }
};

</script>

<style></style>