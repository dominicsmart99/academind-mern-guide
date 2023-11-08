import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/FormHook";

import "./Authentication.css";

function Authenticate() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  function switchModeHandler() {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false } },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  }

  function authenticateHandler(event) {
    event.preventDefault();
    auth.login();
    console.log(formState.inputs);
  }

  return (
    <Card className="authentication">
      <h2>{isLoginMode ? "Login" : "Sign-Up"} Required</h2>
      <hr />
      <form onSubmit={authenticateHandler}>
        {!isLoginMode && (
          <Input
            id="name"
            label="Your Name"
            element="input"
            type="text"
            validators={[VALIDATOR_REQUIRE(5)]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          id="email"
          label="Email"
          element="input"
          type="email"
          placeholder="johndoe@example.com"
          validators={[VALIDATOR_EMAIL(1)]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          label="Password"
          element="input"
          type="password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Password does not meet complexity requirements."
          onInput={inputHandler}
        />
        {!isLoginMode && (
          <Input
            id="password_confirm"
            label="Confirm Password"
            element="input"
            type="password"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please confirm your password"
            onInput={inputHandler}
          />
        )}
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGN UP"}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {!isLoginMode ? "LOGIN" : "SIGN UP"}
      </Button>
    </Card>
  );
}

export default Authenticate;
