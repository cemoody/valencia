import { Auth, Hub } from "aws-amplify";
import React, { useEffect, useState } from "react";
import awsconfig from "../src/aws-exports"; // if you are using Amplify CLI
Auth.configure(awsconfig);

const Footer = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    Hub.listen("auth", data => {
      const { payload } = data;
      const email = payload.data.attributes.email;
      console.log("A new auth event has happened: ", data);
      if (payload.event === "signIn") {
        setEmail(email);
      }
      if (payload.event === "signOut") {
        setEmail("");
      }
    });
  }, []);
  return email !== "" ? (
    <div className="text">Logged in as: {email}</div>
  ) : null;
};

export default Footer;
