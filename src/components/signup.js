import React, { Component } from "react";
import configs from "../config";

// Sign Up component
export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            password: '',
            repassword: '',
            email: '',
            email_sent: false,
            error: ''
        }
        this.register_user = this.register_user.bind(this)
    }

    // Handle change in input and store in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
      };


    // Handle register user button click
    register_user = async(e) => {
        e.preventDefault();

        if (this.state.password.length > 0 &&
            this.state.email.length > 0) {

            if (this.state.password === this.state.repassword) {

                // Call signup API to register user
                const response = await fetch(configs.api_url + "/user/signup", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_name: this.state.user_name,
                        email: this.state.email,
                        password: this.state.password
                    })
                })

                const data = await response.json();

                // If signup is successful
                if (data.success === true) {
                    alert("Verification mail is sent to email ID. Click on it to verify")
                    console.log("Redirecting")
                    window.location = "/";
                }

                // If signup failed
                else
                    this.setState({
                        user_name: "",
                        password: "",
                        repassword: "",
                        email: "",
                        error : data.data
                    });
            } else {
                this.setState({error : "password and retype password should be same"});
            }
        } else {
            this.setState({error : "username and password cannot be empty"});
        }
    }


    render() {
        return (

            <div className = "auth-wrapper"  style = {{"margin-top": "1%", "margin-bottom": "1%" } } >
                <div className = "auth-inner" >
                    <form onSubmit = { this.register_user } >
                        <h3 > Sign up </h3>
                        <div className = "form-group my-1" >
                            <label className = "my-2" > User Name </label>
                            <input type = "text" name="user_name" className = "form-control" placeholder = "Enter user name"
                                value = { this.state.user_name } onChange = { evt => this.handleChange(evt) }
                            />
                        </div>
                        <div className = "form-group my-1" >
                            <label className = "my-2" > Email ID </label>
                            <input type = "email" name="email" className = "form-control" placeholder = "Enter email ID"
                                value = { this.state.email } onChange = { evt => this.handleChange(evt) }
                            />
                        </div>
                        <div className = "form-group my-1" >
                            <label className = "my-2" > Password </label>
                            <input type = "password" name="password" className = "form-control" placeholder = "Enter password"
                                value = { this.state.password } onChange = { evt => this.handleChange(evt) }
                            />
                        </div >
                        <div className = "form-group my-1" >
                            <label className = "my-2" > Retype Password </label>
                            <input type = "password" name="repassword" className = "form-control" placeholder = "Retype password"
                                value = { this.state.repassword } onChange = { evt => this.handleChange(evt) }
                            />
                        </div >
                        <span className="alert-danger">{this.state.error}</span>
                        <button type = "submit" className = "btn btn-primary btn-block w-100 my-3" > Sign up </button>

                        <p>Already have an account? <a href="/">login</a></p>

                    </form >
                </div>
            </div >
        );
    }
}
