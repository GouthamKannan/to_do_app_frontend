import { React, Component } from "react";
import {Navbar} from 'react-bootstrap'
import Cookies from 'js-cookie';
import configs from "../config";

/**
 * Component for Todo application
 */
class Todo extends Component {
  /**
   * Intialize the task list of the component
   */
  constructor(props) {
    super(props);
    this.state = {
      user : "",
      task: "",
      error: {
        task: "",
      },
      touch: {
        task: false,
      },
      taskList: [],
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.log_out = this.log_out.bind(this);
  }

    componentDidMount = async() => {

        // Get user name from URL
        const windowUrl = window.location;
        await this.setState({user_name : windowUrl.toString().split('/').pop().replace("?", "").replace("#", "")});

        // Get the tasks of the user from API
        var response = await fetch(configs.api_url + "/task/get_tasks", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_name : this.state.user_name
            })
        })
        var data = await response.json()
        if (data.data.length > 0) {
            this.setState({taskList : data.data})
        }
    }

  /**
   * Handle the change in input text field
   */
  handleChange = ({ target: { name, value } }) => {
    const error = { ...this.state.error };
    error.task = !value ? " Please enter a task" : "";
    this.setState({ ...this.state, [name]: value, error });
  };

  handleBlur = ({ target: { name } }) => {
    const touch = { ...this.state.touch, [name]: true };
    this.setState({ touch });
  };

  /**
   * Handle add button click
   */
  handleSubmit = async(event) => {
    event.preventDefault();
    const touchList = Object.values(this.state.touch).filter((value) => !value);
    const errorList = Object.values(this.state.error).filter(
      (value) => value !== ""
    );
    if (!touchList.length && !errorList.length) {
      var cur_id = this.state.taskList.length
                    ? this.state.taskList.slice(-1)[0].id + 1
                    : 0
      const task = {
        id: cur_id,
        value: this.state.task,
        completed: false,
      };

      // Update the task list
      const taskList = this.state.taskList;
      taskList.push(task);

      // Save the task in database using API
      var response = await fetch(configs.api_url + "/task/add_task", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: cur_id,
                user_name : this.state.user_name,
                value: this.state.task,
                completed: false,
            })
        })
        var data = await response.json()
        if(data.success) {
        }

      // Update the state variable
      const touch = { ...this.state.touch, task: false };
      this.setState({ ...this.state, task: "", touch, taskList });

      console.log(this.state.taskList)

    }
  };

  /**
   * Handle checking check boxes
   */
  handleCheck = async(event, id) => {
    const task = this.state.taskList.filter((value) => value.id === id);

    console.log(task)
    console.log(id)

    // Update the task using API
    var response = await fetch(configs.api_url + "/task/check_task", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id : id,
            user_name : this.state.user_name,
            completed: event.target.checked,
        })
    })

    var data = await response.json()

    // Task updated succesfully
    if(data.success) {
        task[0].completed = event.target.checked;

        // Get the updated tasks
        response = await fetch(configs.api_url + "/task/get_tasks", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_name : this.state.user_name
            })
        })
        data = await response.json()

        // Update the state variable
        if (data.data.length > 0) {
            this.setState({taskList : data.data})
        }
    }
    else{
        alert("Cannot mark task as completed")
    }
    console.log(this.state.taskList)


  };

  /**
   * Handle remove button
   */
  handleDelete = async(event, id) => {
    event.preventDefault();
    const taskList = this.state.taskList.filter((value) => value.id !== id);

    // Delete the task using API
    var response = await fetch(configs.api_url + "/task/delete_task", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            user_name : this.state.user_name
        })
    })
    var data = await response.json()

    // Update the state variable
    if(data.success) {
        this.setState({ ...this.state, taskList });
    }
    else {
        alert("Cannot delete task")
    }



  };


  // Handling log out
  log_out = async() => {
      Cookies.remove("session_id")
    await fetch(configs.api_url + "/user/logout", {
        method : "GET",
        credentials: "include",
    })
    window.location = "/"
  }

  // Render the input text field and list of tasks
  render() {
    if(Cookies.get('session_id')) {
        return (
        <>
            <div>
                <Navbar bg="light" expand="lg">

                <div style={{"float" : "left", "margin-left" : "20%"}}>
                <span >{this.state.user_name}</span>
                </div>

                <div style={{"float" : "left", "margin-left" : "60%"}}>
                <button className="btn btn-secondary btn-block" onClick={this.log_out}>Log out</button>
                </div>
                </Navbar>
                </div>
            <div className="container" style={{"height":"80%"}}>
            <div className="row">
                <div className="col-md-12">
                <div className="card card-white">
                    <div className="card-body">
                    <h1 className="text-center pt-2 pb-4">TODO App</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="form-group col-sm-9">
                            <input
                            type="text"
                            name="task"
                            placeholder="Enter a Task"
                            value={this.state.task}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            required
                            className="form-control add-task mb-2"
                            ></input>
                            <span className="error">{this.state.error.task}</span>
                        </div>
                        <div className="col-sm-2">
                            <button
                            className="btn btn-primary btn-block"
                            type="submit"
                            >
                            Add
                            </button>
                        </div>
                        </div>
                    </form>

                    <div className="todo-list">
                        {this.state.taskList !== []
                        ? this.state.taskList.map((task) => (
                            <div className="row my-1">
                                <div className="col-sm-1"></div>
                                <div className="todo-item col-sm-10">
                                <div className="row">
                                    <div className="col-sm-10">
                                    <input
                                        className="checker mx-2 align-middle"
                                        type="checkbox"
                                        onChange={(event) => {}}
                                        checked={task.completed ? true : false}
                                        id={task.id}
                                        onClick={(event) =>
                                        this.handleCheck(event, task.id)
                                        }
                                    ></input>
                                    <label
                                        className={
                                        task.completed
                                            ? "checked align-middle"
                                            : "align-middle"
                                        }
                                        for={task.id}
                                    >
                                        {task.value}
                                    </label>
                                    </div>
                                    <div className="col-sm-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={(event) =>
                                        this.handleDelete(event, task.id)
                                        }
                                    >
                                        Remove
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            ))
                        : null}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
        );
    }
    else {
        window.location = "/";
    }
}
}

export default Todo;
