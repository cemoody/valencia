import React, { useState, useReducer } from "react";

import { Auth } from "aws-amplify";

const initialFormState = {
  password: "",
  email: "",
  confirmationCode: ""
};

function reducer(state, action) {
  let newState = Object.assign({}, state);
  newState[action.target.name] = action.target.value;
  return newState;
}

async function signUp({ password, email }, updateFormType) {
  const username = email;
  await Auth.signUp({
    username,
    password,
    attributes: { email }
  });
  console.log("sign up success!");
  updateFormType("confirmSignUp");
}

async function confirmSignUp({ email, confirmationCode }, updateFormType) {
  try {
    await Auth.confirmSignUp(email, confirmationCode);
    console.log("confirm sign up success!");
    updateFormType("signIn");
  } catch (err) {
    console.log("error signing up..", err);
  }
}

async function signIn({ username, password }) {
  try {
    await Auth.signIn(username, password);
    console.log("sign in success!");
  } catch (err) {
    console.log("error signing up..", err);
  }
}

export default function AuthForm() {
  const [formType, updateFormType] = useState("signUp");
  const [formState, updateFormState] = useReducer(reducer, initialFormState);
  console.log(formState);
  function renderForm() {
    switch (formType) {
      case "signUp":
        return (
          <SignUp
            signUp={() => signUp(formState, updateFormType)}
            updateFormState={e => {
              console.log(e);
              updateFormState({ type: "updateFormState", target: e.target });
            }}
          />
        );
      case "confirmSignUp":
        return (
          <ConfirmSignUp
            confirmSignUp={() => confirmSignUp(formState, updateFormType)}
            updateFormState={e =>
              updateFormState({ type: "updateFormState", target: e.target })
            }
          />
        );
      case "signIn":
        return (
          <SignIn
            signIn={() => signIn(formState)}
            updateFormState={e =>
              updateFormState({ type: "updateFormState", target: e.target })
            }
          />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <div>{renderForm(formState)}</div>
      {formType === "signUp" && (
        <p style={styles.footer}>
          <span style={styles.anchor} onClick={() => updateFormType("signIn")}>
            Sign In
          </span>
        </p>
      )}
      {formType === "signIn" && (
        <p style={styles.footer}>
          <span style={styles.anchor} onClick={() => updateFormType("signUp")}>
            Sign Up
          </span>
        </p>
      )}
    </div>
  );
}

function SignUp(props) {
  return (
    <div style={styles.container}>
      <input
        name="email"
        onChange={e => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder="email"
      />
      <input
        type="password"
        name="password"
        onChange={e => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder="password"
      />
      <button onClick={props.signUp} className="buttonHighlight">
        Get In
      </button>
    </div>
  );
}

function SignIn(props) {
  return (
    <div style={styles.container}>
      <input
        name="username"
        onChange={e => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder="username"
      />
      <input
        type="password"
        name="password"
        onChange={e => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
        placeholder="password"
      />
      <button style={styles.button} onClick={props.signIn}>
        Sign In
      </button>
    </div>
  );
}

function ConfirmSignUp(props) {
  return (
    <div style={styles.container}>
      <input
        name="confirmationCode"
        placeholder="Confirmation Code"
        onChange={e => {
          e.persist();
          props.updateFormState(e);
        }}
        style={styles.input}
      />
      <button onClick={props.confirmSignUp} style={styles.button}>
        Confirm Sign Up
      </button>
    </div>
  );
}

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
  button: {
    backgroundColor: "#006bfc",
    color: "white",
    width: 316,
    height: 45,
    marginTop: 10,
    fontWeight: "600",
    fontSize: 14,
    cursor: "pointer",
    border: "none",
    outline: "none",
    borderRadius: 3,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, .3)"
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
