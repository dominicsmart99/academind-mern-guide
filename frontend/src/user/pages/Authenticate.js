import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/FormHook";

import "./Authentication.css";

function Authenticate() {
  const [formState, inputHandler] = useForm(
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

  function authenticateHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authenticateHandler}>
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
        <Button type="submit" disabled={!formState.isValid}>
          LOGIN
        </Button>
      </form>
    </Card>
  );
}

export default Authenticate;
