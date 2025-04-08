import { atom } from "recoil";

export const servicesAtom = atom({
  key: "servicesAtom",
  default: [],
});

export const selectedServiceAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
