import Amplify, { Hub } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

export const listenUser = callback => {
  Hub.listen("auth", data => {
    const { payload } = data;
    if (payload.event === "signIn") {
      console.log("signin");
      callback(payload);
    }
    if (payload.event === "signOut") {
      console.log("signout");
      callback("");
    }
  });
  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      console.log("authed in");
      callback(user);
      return user;
    } catch (err) {
      console.log("err");
      return err;
    }
  };
  checkUser();
};
