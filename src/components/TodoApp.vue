<template>
  <div class="container" style="max-width: 1000px">
    <a
      @click="logout()"
      data-v-229a287b=""
      href="#"
      class="btn btn-info btn-md"
      style="position: absolute; right: 20px; top: 20px"
      ><span data-v-229a287b="" class="glyphicon glyphicon-log-out"></span> Log
      out
    </a>
    <!-- Heading -->
    <img
      src="https://todo26.s3.amazonaws.com/icons8-todo-list.gif"
      alt="none"
      width="100"
      height="100"
    />
    <h2 class="text-center mt-5">{{ getUserName() }} Todo List</h2>

    <!-- Add new Task  popup-->
    <div class="d-flex justify-content-center mt-5">
      <b-button
        id="show-btn"
        class="btn btn-info rounded-50 w-50 form-control"
        @click="$bvModal.show('bv-modal-example')"
        >Add New Task</b-button
      >
      <b-modal id="bv-modal-example" hide-footer>
        <template #modal-title>Add New Task</template>
        <!-- Task name  -->
        <b-form-group
          label="Task Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input id="name-input" v-model="name" required minlength="2"></b-form-input>
        </b-form-group>
        <!-- Task description-->
        <b-form-group
          label="description"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-textarea
            id="name-input"
            v-model="description"
            required
          ></b-form-textarea>
        </b-form-group>
        <!-- Task priority-->
        <b-form-group label="Priority" label-for="input-3">
          <b-form-select
            id="input-3"
            v-model="priority"
            :options="priorityOptions.slice(1,6)"

            required
          ></b-form-select>

        <!-- Attachment
        <div class="form-group">
          <label for="exampleFormControlFile1">Attachment</label>
          <input
            type="file"
            class="form-control-file"
            id="exampleFormControlFile1"
          />
        </div>-->
        <b-button type="submit" class="btn btn-info mt-3" block @click="AddTask()"
          >Add</b-button>
        </b-form-group>
      </b-modal>
    </div>

    <!-- Task table -->
    <table class="table table-bordered mt-5">
      <!-- table header  -->
      <thead>
        <tr>
          <th scope="col" class="bg-secondary text-white">Task Status</th>
          <th scope="col" class="bg-secondary text-white">Task</th>
          <th scope="col" class="bg-secondary text-white text-center">
            Priority
          </th>
          <th scope="col" class="bg-secondary text-white text-center">
            Delete
          </th>
          <th scope="col" class="bg-secondary text-white text-center">Edit</th>
        </tr>
      </thead>
      <!-- table body-->
      <tbody>
        <tr v-for="(task, index) in tasks" :key="task.taskId">
          <td
            class="pointer noselect"
            @click="changeStatus(index)"
            :class="{ 
              color3: task.status == 0,
              color1: task.status == 1,
              color2: task.status == 2,
            }"
          >
            <span>
              {{ statuses[task.status] }}
            </span>
          </td>
          <td
            :id="'task' + index"
            class="pointer noselect"
            @click="showTodo(task.id)"
          >
            <!-- <b-tooltip :target="'task' + index" triggers="hover">
              {{ task.description }}</b-tooltip
            > -->
            <span
              :class="{
                'line-through': task.status === 2,
              }"
              v-tooltip.top="task.description"           
            >
              {{ task.task }}
            </span>
          </td>
          <td class="text-center"  :class="{
                'line-through': task.status === 2,
              }">
            <div>
              {{ priorityOptions[task.priority] }}
            </div>
          </td>
          <td class="text-center">
            <div class="pointer noselect" @click="deleteTask(index)">
              <span class="fas fa-times-circle"></span>
            </div>
          </td>
          <td class="text-center">
            <div class="pointer noselect" @click="OpenModal(task)">
              <p class="fas fa-edit"></p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <edit_todolist
      :todoobject="taskItem"
      @updateItem="updateTodoItem"
    ></edit_todolist>
  </div>
</template>

<script>
import edit_todolist from "./edit_todolist.vue";


export default {
  name: "HelloWorld",
  components: { edit_todolist },
  props: {
    msg: String,
  },
  data() {
    return {
      name: "", //name of the task to add
      description: "", // description of the task
      priority: "Medium", // priority of the task
      priorityOptions: ["", "Very Low", "Low", "Medium", "High", "Very High"], //choosebox options
      statuses: ["To do", "In Progress", "Done"],
      /* Status could be: 'to-do' / 'in-progress' / 'finished' */
      tasks: [],
      task: "",
      todoName: "",
      taskItem: {},
      editedTask: null,

      test: {
        id: 123,
        name: "Steal bananas from the supermarket.",
        description: "i want to eat",
        status: "To do",
        Priority: "Very Low",
      },
    };
  },
  mounted: function () {
    console.log("mounted..");
    if (this.$store.state.user.email == "") this.$router.push({ name: "Home" });
    this.refreshTaskList();
    window.setInterval(() => {
      this.refreshTaskList();
    }, 3000);
  },
  methods: {
    //adding a new Task
    AddTask() {
      console.log("adding a task");
      console.log("task name: " + this.name);
      console.log("task desc: " + this.description);
      console.log("task prio: " + this.priority);

      console.log(this.$store.state.user.email);
      if(this.name == "" | this.name.length < 2 | this.name.length > 20)
        return false;
      

      const priorityValue = this.priorityOptions.indexOf(this.priority);

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: this.$store.state.user.email,
          task: this.name,
          description: this.description,
          priority: priorityValue,
          status: 0,
        }),
      };

      fetch(this.$store.state.serverUri + "tasks", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (response.ok) {
            console.log("task has been added successfully");
            this.$router.push({ name: "Page" });
            this.refreshTaskList();
            this.name = "";
            this.description = "";
            this.priority = "";
          } else {
            // get error message from body or default to response status
            console.log("failed to add the task");
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
      this.$bvModal.hide("bv-modal-example");
    },
    refreshTaskList() {
      // console.log("refreshing tasklist");
      // console.log("user email: " + this.$store.state.user.email);
      const requestOptions = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };

      fetch(
        this.$store.state.serverUri +
          "tasks?user=" +
          this.$store.state.user.email,
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();
          this.tasks = data;
          // check for error response
          if (response.ok) {
            // console.log("task list refreshed successfully");
            // console.log(data);
          } else {
            // get error message from body or default to response status
            console.log("failed to refresh the tasks");
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    changeStatus(index) {
      // this.tasks[index].status++;
      // if(this.tasks[index].status > 2) this.tasks[index].status = 0;

      const requestOptions = {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: this.tasks[index].taskId,
          userEmail: this.$store.state.user.email,
          task: this.tasks[index].task,
          description: this.tasks[index].description,
          priority: this.tasks[index].priority,
          status:
            this.tasks[index].status + 1 > 2 ? 0 : this.tasks[index].status + 1,
        }),
      };

      fetch(
        this.$store.state.serverUri +
          "tasks?email=" +
          encodeURIComponent(this.$store.state.user.email),
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (response.ok) {
            console.log("task has been edited successfully");
            this.refreshTaskList();
          } else {
            // get error message from body or default to response status
            console.log("failed to edit the task");
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    deleteTask(index) {
      console.log("deleting a task: " + index);
      console.log("task id: " + this.tasks[index].taskId);
      console.log(
        this.$store.state.serverUri +
          "tasks?email=" +
          encodeURIComponent(this.$store.state.user.email) +
          "&taskId=" +
          this.tasks[index].taskId
      );
      const requestOptions = {
        method: "DELETE",
        headers: {
          Accept: "*/*",
        },
      };

      fetch(
        this.$store.state.serverUri +
          "tasks?email=" +
          encodeURIComponent(this.$store.state.user.email) +
          "&taskId=" +
          this.tasks[index].taskId,
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();
          // check for error response
          if (response.ok) {
                this.refreshTaskList();
            console.log("task item deleted successfully");
            console.log(data);
          } else {
            // get error message from body or default to response status
            console.log("failed to delete the task");
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    /**
     * Edit task
     */

    editTask(index) {
      this.task = this.tasks[index].name;
      this.editedTask = index;
    },
    getUserName() {
      return this.$store.state.user.username;
    },

    OpenModal(task) {
      this.taskItem = task;
      this.$bvModal.show("bv-modal-example2");
    },

    updateTodoItem(targetTodo) {
      this.$bvModal.hide("bv-modal-example2");
      this.findTodoItemByID(targetTodo);
    },
    logout() {
      this.$store.commit("changeEmail", "");
      this.$store.commit("changeUsername", "");
      this.$router.push({ name: "Home" });
    },

    findTodoItemByID(targetTodo) {
      this.tasks.forEach((todo, index) => {
        if (todo.id == targetTodo.id) this.$set(this.tasks, index, targetTodo);
      });
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.line-through {
  text-decoration: line-through;
}

.color2 {
  background-color: #69f0ae;
}
.color1 {
  background-color: #fff59d;
}
.color3 {
  background-color: #ff6e40;
}
</style>
