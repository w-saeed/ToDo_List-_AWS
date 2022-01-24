<template>
  <b-modal id="bv-modal-example2" hide-footer>
    <template #modal-title>Edit Task</template>
    <!-- Task name  -->
    <b-form-group
      label="Task Name"
      label-for="name-input"
      invalid-feedback="Name is required"
    >
      <b-form-input
        id="name-input"
        :value="todoobject.task"
        @input="updateTaskName"
        required
      ></b-form-input>
    </b-form-group>
    <!-- Task description-->
    <b-form-group
      label="description"
      label-for="name-input"
      invalid-feedback="Name is required"
    >
      <b-form-textarea
        id="name-input"
        :value="todoobject.description"
        @input="updateDescription"
        required
      ></b-form-textarea>
    </b-form-group>
    <!-- Task priority-->
    <b-form-group label="Priority" label-for="input-3">
      <b-form-select
        id="input-3"
        :value="Priority[todoobject.priority]"
        :options="Priority"
        @change="updatePriority"
        required
      ></b-form-select>
    </b-form-group>
    <b-button class="btn btn-info mt-3" block @click="editedTask()">Edit</b-button>
  </b-modal>
</template>

<script>
export default {
  name: "edit_todolist",
  props: {
    todoobject: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      taskName: "",
      description: "",
      priority: "",
      Priority: ["Very Low", "Low", "Medium", "High", "Very High"],
    };
  },
 created(){
 },
  methods: {
    updateTaskName(val) {
      this.taskName = val;
    },
    updateDescription(val) {
      this.description = val;
    },
    updatePriority(val) {
      this.priority = val;
    },
    editedTask() {
      // console.log(this.todoobject);
      // console.log("taskname: " + this.taskName);
      // console.log("this desc: " + this.description);
      // console.log("prio text: " + this.priority)
      // console.log("prio : " + (this.priority == ""? this.todoobject.priority : this.Priority.indexOf(this.priority)));
      // console.log("status: " + this.todoobject.status);
      //this.$bvModal.hide("bv-modal-example");
      // console.log(JSON.stringify({
      //       "taskId":this.todoobject.taskId,
      //       "userEmail": this.$store.state.user.email,
      //       "task": this.taskName == ""?this.todoobject.task:this.taskName ,
      //       "description": this.description,
      //       "priority": this.priority == ""? this.todoobject.priority : this.Priority.indexOf(this.priority),
      //       "status": this.todoobject.status,
      //     }));

      const requestOptions = {
          method: 'PUT',
          headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "taskId":this.todoobject.taskId,
            "userEmail": this.$store.state.user.email,
            "task": this.taskName == ""?this.todoobject.task:this.taskName,
            "description": this.description,
            "priority": this.priority == ""? this.todoobject.priority : this.Priority.indexOf(this.priority),
            "status": this.todoobject.status,
          })
        };

        fetch(this.$store.state.serverUri + 'tasks?email=' + encodeURIComponent(this.$store.state.user.email), requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (response.ok) {
                  console.log("task has been edited successfully");
                  this.$bvModal.hide("bv-modal-example2");
                  } else {                        
                    // get error message from body or default to response status
                    console.log("failed to edit the task");
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
            .catch(error => {
                this.errorMessage = error;
                console.error('There was an error!', error);
            });

    },
  },
};
</script>

<style scoped></style>
