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
    const checkUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log(user);
        setEmail(user.attributes.email);
        return user;
      } catch (err) {
        return err;
      }
    };
    checkUser();
  }, []);
  return email !== "" ? (
    <div className="footer">
      <div className="text">Logged in as: {email}</div>
    </div>
  ) : null;
};

export default Footer;
