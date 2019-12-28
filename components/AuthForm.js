import React, { useState, useReducer } from "react";
import { Auth } from "aws-amplify";
import { Loader, Dimmer } from "semantic-ui-react";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI
import Footer from "../components/Footer";

Auth.configure(awsconfig);

const initialFormState = {
  username: "",
  password: "",
  email: "",
  confirmationCode: ""
};

async function signIn(username, password) {
  try {
    console.log(username, password);
    const ret = await Auth.signIn(username, password);
    console.log("sign in success!", ret);
  } catch (err) {
    console.log("error signing up..", err);
  }
}

const AuthForm = props => {
  const [loading, setLoading] = useState(false);
  const [formState, updateFormState] = useState(initialFormState);
  console.log({ formState, loading });
  return (
    <div style={styles.container}>
      <input
        name="email"
        onChange={e => {
          e.persist();
          console.log(e);
          let newState = Object.assign({}, formState);
          newState[e.target.name] = e.target.value;
          updateFormState(newState);
        }}
        style={styles.input}
        placeholder="email"
      />
      <input
        type="password"
        name="password"
        onChange={e => {
          e.persist();
          console.log(e);
          let newState = Object.assign({}, formState);
          newState[e.target.name] = e.target.value;
          updateFormState(newState);
        }}
        style={styles.input}
        placeholder="password"
      />
      <button
        className="buttonHighlight"
        onClick={() => {
          setLoading(true);
          signIn(formState.email, formState.password);
          setLoading(false);
        }}
      >
        <Dimmer active={loading}>
          <Loader active={loading} />
        </Dimmer>
        Get In
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    height: 45,
    marginTop: 8,
    width: 300,
    maxWidth: 300,
    padding: "0px 8px",
    fontSize: 16,
    outline: "none",
    border: "none"
  },
  input: {
    height: 45,
    marginTop: 8,
    width: 300,
    maxWidth: 300,
    padding: "0px 8px",
    fontSize: 16,
    outline: "none",
    border: "none",
    borderBottom: "2px solid rgba(0, 0, 0, .3)"
  },
  footer: {
    fontWeight: "600",
    padding: "0px 25px",
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.6)"
  },
  anchor: {
    color: "#006bfc",
    cursor: "pointer"
  }
};

export default AuthForm;
