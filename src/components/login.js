import Cookies from "js-cookie";
import React, { Component } from "react";
import configs from '../config';

// Login Component
export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email : '',
            password : '',
            error : ''
        }
        this.login_user = this.login_user.bind(this)
    }

    // Handle changes in input fields and store them in state
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
      };

    componentDidMount() {

        // Display message if redirected from email verification link
        const windowUrl = window.location;
        console.log(windowUrl)
        var message = windowUrl.toString().split('/').pop().replace("?", "").replace("#", "")
        if(message === "email_verified") {
            alert("Your email is verified. Login to your account")
        }
    }

    // Handle login button click
    login_user = async(e) => {
        e.preventDefault();

        if(this.state.email.length > 0 && this.state.password.length > 0) {

            // Call the login API
            const response = await fetch(configs.api_url + "/user/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    email : this.state.email,
                    password : this.state.password
                })
            });

            const data = await response.json();

            // Redirect when login is successful
            if(data.success === true) {
                console.log(data)
                Cookies.set("session_id",data.session_id)
                window.location = "/home-page/" + data.data
            }

            // Login failed
            else
                this.setState({
                    email: '',
                    password: '',
                    error : data.data
                })
        }
        else {
            this.setState({error : "username and password cannot be empty"})
        }

    }

    render() {
        return (
            <>
            <div className="auth-wrapper" style = {{ "margin-top": "5%", "margin-bottom" : "5%"} }>
                <div className="auth-inner">
                    <form onSubmit={this.login_user}>
                        <h3>Log In</h3>
                        <div className="form-group my-1">
                            <label className="my-2">Email ID</label>
                            <input type="email" name="email" className="form-control" placeholder="Enter email ID"
                             value={this.state.email} onChange={evt => this.handleChange(evt)}/>
                        </div>
                        <div className="form-group my-1">
                            <label className="my-2">Password</label>
                            <input type="password" name="password" className="form-control" placeholder="Enter password"
                            value={this.state.password} onChange={evt => this.handleChange(evt)}/>
                        </div>
                        <span className="alert-danger">{this.state.error}</span>
                        <button type="submit" className="btn btn-primary btn-block w-100 my-3">Log in</button>
                        <p>Don't have an account? <a href="/sign-up">register</a></p>
                        <p><a href="/forget-password">forget password</a></p>
                    </form>
                </div>
            </div>
            </>
        );
    }
}
