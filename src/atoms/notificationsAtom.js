import { atom } from "recoil";

export const notificationsAtom = atom({
  key: "notificationsAtom",
  default: [],
});

export const selectedNotificationAtom = atom({
  key: "selectedNotificationAtom",
  default: {
    _id: "",
    userId: "",
    message: "",
    roles: "",
  },
});
