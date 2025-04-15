import { atom } from "recoil";

export const customersAtom = atom({
  key: "customersAtom",
  default: [],
});

export const selectedCustomerAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
