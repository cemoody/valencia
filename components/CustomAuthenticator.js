import {
  Authenticator,
  SignIn,
  SignUp,
  ConfirmSignUp,
  Greetings
} from "aws-amplify-react";

const AlwaysOn = props => {
  return (
    <div>
      <div>I am always here to show current auth state: {props.authState}</div>
      <button onClick={() => props.onStateChange("signUp")}>
        Show Sign Up
      </button>
    </div>
  );
};

const cauth = () => {
  return (
    <Authenticator
      hideDefault={false}
      onStateChange={this.handleAuthStateChange}
    >
      <SignIn />
      <SignUp />
      <ConfirmSignUp />
      <Greetings />
      <AlwaysOn />
    </Authenticator>
  );
};

export default cauth;
