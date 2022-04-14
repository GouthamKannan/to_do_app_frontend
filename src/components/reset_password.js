import React, { Component } from "react";
import configs from "../config";

// Reset password component
export default class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            password: '',
            repassword: '',
            reset_code: '',
            error: ''
        }
        this.change_password = this.change_password.bind(this);
    }

    componentDidMount() {

        // Get the reset code from URL
        const windowUrl = window.location;
        this.setState({
            reset_code : windowUrl.toString().split('/').pop()
        });
    }

    // Handle change in input and store in stae
    handleChange = ({ target: { name, value } }) => {
        this.setState({ ...this.state, [name]: value });
      };

    // Handle change password button click
    change_password = async(e) => {
        e.preventDefault()

        if (this.state.repassword.length > 0 && this.state.password.length > 0) {

            if (this.state.password === this.state.repassword) {

                // Call the reset password API
                const response = await fetch(configs.api_url + "/user/reset_password", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        password: this.state.password,
                        reset_code: this.state.reset_code,
                    })
                })

                const data = await response.json();

                // Reset password is successful
                if (data.success === true) {
                    alert("Password changed successfully. Login using new password")
                    window.location = "/";
                }

                // Error in reset password
                else
                {
                    this.setState({
                        password : "",
                        repassword : "",
                        error : data.data
                    });
                }
            } else {
                this.setState({error : "password and retype password should be same"});
            }
        } else {
            this.setState({error : "Fields cannot be empty"});
        }
    }

    render() {
        return (

            <div className = "auth-wrapper"  style = {{"margin-top": "5%", "margin-bottom": "5%" } } >
                <div className = "auth-inner" >
                    <form onSubmit = { this.change_password } >
                        {
                            <div>
                                <div className = "form-group my-1" >
                                    <label className = "my-2" > New Password </label>
                                    <input type = "password" name="password" className = "form-control" placeholder = "Enter password"
                                        value = { this.state.password } onChange = { evt => this.handleChange(evt) }
                                    />
                                </div >
                                <div className = "form-group my-1" >
                                    <label className = "my-2" > Retype New Password </label>
                                    <input type = "password" name="repassword" className = "form-control" placeholder = "Retype password"
                                        value = { this.state.repassword } onChange = { evt => this.handleChange(evt) }
                                    />
                                </div >
                                <span className="alert-danger">{this.state.error}</span>
                                <button type = "submit" className = "btn btn-primary btn-block w-100 my-3" > Reset Password </button>
                            </div>
                        }
                        <p>Create a new account? <a href="/sign-up">Signup</a></p>
                    </form >
                </div>
            </div >
        );
    }
}