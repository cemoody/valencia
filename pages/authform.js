import React, { useState, useReducer } from "react";
import { Auth } from "aws-amplify";
import { Icon, Loader, Dimmer } from "semantic-ui-react";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI
import Head from "next/head";
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
      <Head>
        <title>algopipes</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <link href="/index.css" rel="stylesheet" />
      </Head>
      <div id="main">
        <div id="inner">
          <div>
            <span className="logoicon">
              <Icon fitted name="cubes" size="huge" inverted />
            </span>
            <span className="title fs25"> algopipes </span>
            <p />
            <span className="subtitle">
              Create a search page from your embeddings.
              <span className="highlight"> Free. </span>
            </span>
            <p />
            <p />
            <p />
          </div>
        </div>
      </div>
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
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 150,
    justifyContent: "center",
    alignItems: "center"
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
