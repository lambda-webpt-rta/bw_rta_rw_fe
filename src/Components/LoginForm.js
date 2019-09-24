import React, {useState, useEffect} from "react";
import {withFormik, Form, Field} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {Link} from "react-router-dom";
import {Button} from 'reactstrap';



const LoginForm=( {values, errors, touched, isSubmitting, status, }, props ) => {
    const initialUser={username: '', password: ''};
    const [user, setUser]=useState( initialUser );

    return (
        <Form>

            <div>
            <h5>Username</h5>
                    <div>{touched.username&&errors.username&&<p>{errors.username}</p>}
                        <Field type="username" name="username" placeholder="Username" />
                    </div>

                    <h5>Password</h5>
                     <div>{touched.password&&errors.password&&<p>{errors.password}</p>}
                        <Field type="password" name="password" placeholder="password" />
                    </div>
                <br/>
                <div><Button type="submit" disabled={isSubmitting} >Login</Button></div>
                <h2>Don't have an account yet?</h2>
                <Link to="/signup">Create an account</Link>

            </div>
        </Form>
    )
}

const FormikLoginForm=withFormik( {
    mapPropsToValues: ( props ) => {
        return {
            username: props.username||'',
            password: props.password||'',
        }
        console.log( props )
    },
    validationSchema: Yup.object().shape( {
        username: Yup.string().required( "username is required" ),
        password: Yup.string().min( 6, "password must be 6 characters or longer" )
            .required( "password is required" )

    } ),
    handleSubmit( values, {resetForm, setSubmitting, setStatus, submitForm}, props ) {
        axios.post( "https://lambda-webpt-rta-api.herokuapp.com/api/auth/login", values )

            .then( ( res ) => {
                const userInfo=res.data.user.token||res.data.token;
                localStorage.setItem( "token", userInfo );
                props.history.push( "/dashboard" );
                console.log( res );
                resetForm();    
                setSubmitting( false );
                submitForm( false );

            } )
            .catch( ( error ) => {console.error( error )}
            )

    }

} )( LoginForm )
export default FormikLoginForm;

