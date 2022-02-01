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

      <div class="col-span-2 gap-y-4 grid grid-col-2">
         <div class="">
        <select class="px-4 py-3" v-model="serviceId">
          <option v-for="svce in services" :key="svce.id" :value="svce.id">{{svce.name}}</option>
        </select>     
      </div>

        <div>
          <select class="px-4 py-3" @change="schedulesByServiceAndWeekNo($event)">
            <option value= ""></option> 
            <option v-for="week in weeks" :key="week.weekNo" :value="week.weekNo">{{week.text}}</option>
          </select>
        </div>

      <div v-if="week">
          <h4>del {{`${week}`}}</h4>
      </div>
      </div>

     

      <div class="col-span-1" v-if="canSubmit">
           <button type="button" @click="submitSchedules" class="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Enviar horarios
          </button>
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
                      <th v-for="employee in employees" :key="employee.id" scope="col" :style="{backgroundColor:`#${employee.color}`}" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        {{employee.name}}
                      </th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b" v-for="date in data.dates" :key="date.hour">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" :id="date.id" style="background-color:#FF3723">
                        {{date.schedule_hours}}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" v-for="employee in employees" :key="employee.id">
                        <input type="checkbox" class="indeterminate:bg-gray-300 " :key="employee.id" :id="`${employee.id}_${date.id}`" @change= "AddScheduleToEmployee"/>
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


export default {

  name: 'shceduler',
  components: {
   
  },
  serviceId: null,
  headers: { "Content-Type": "application/json" },
  employeeHours: [],
  canSubmit: false,
  data() {

  
   
    const schedulesByServiceAndWeekNo = ({target: {value} })=>{
      console.log(value);
      const headers = this.headers;
      axios.get(`http://localhost:3000/api/services/${this.serviceId}/${value}/schedules`, { headers })
      .then(response => { 
      this.schedules = response.data.schedules;
      this.week = `${response.data.week}`;
      });

  
    }

      const AddScheduleToEmployee = ({target})=>{
        const [employeeId,scheduleId] = target.id.split('_');
      // console.log(target.checked)
      // console.log(typeof employeeId)
      

      const scheduleEmployeeFoundIndex = this.employeeHours.findIndex(employee => +employee.scheduleId== +scheduleId && +employee.id == +employeeId);
      
     if(target.checked){
       const employeeSchedule = {id: +employeeId,scheduleId:+scheduleId};
       this.employeeHours.push(employeeSchedule)
     }else if(!target.checked && scheduleEmployeeFoundIndex != -1 ){
     //replace the employee object
     this.employeeHours.splice(scheduleEmployeeFoundIndex,1);
     }

     console.log(this.employeeHours)
    

     

     //Change the color of the td
      let td = document.querySelector(`td[id='${scheduleId}']`);
      let color = '#FF3723'; //red
      this.canSubmit = false;

     if(this.employeeHours.filter(e => e?.scheduleId == scheduleId).length > 0){
      color = '#51FF3D'; //green
      this.canSubmit= true;
     }
      td.style.backgroundColor = color;
     
    } 

    //submit action

    const submitSchedules = async (event)=>{
      event.preventDefault();

      const {data} = await axios.post("http://localhost:3000/api/employees/scheduler",{schedules: this.employeeHours, serviceId:this.serviceId});
      alert(data.message);
     // this.$router.push(`/employee/${data.employee_id}/schedule`)



    }

    return {
      name,
      serviceId: null,
      week: "",
      employees: [],
      services: [],
      schedules: [],
      weeks: [],
      schedulesByServiceAndWeekNo,
      AddScheduleToEmployee,
      canSubmit: false,
      submitSchedules
    };
  },
  created() {
    // GET request using axios with set headers
    const headers = this.headers;
    this.employeeHours = [];
    axios.get("http://localhost:3000/api/employees", { headers })
      .then(response => {
      this.employees = response.data;
        });

      axios.get("http://localhost:3000/api/services", { headers })
      .then(response => this.services = response.data);

       axios.get("http://localhost:3000/api/catalogs/weeks", { headers })
      .then(response => this.weeks = response.data.dates);
  }
};

</script>

<style></style>