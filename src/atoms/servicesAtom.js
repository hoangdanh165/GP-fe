import { atom } from "recoil";

export const servicesAtom = atom({
  key: "servicesAtom",
  default: [],
});

export const selectedServiceAtom = atom({
  key: "selectedServiceAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
