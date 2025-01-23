import PushNotification, { Importance } from "react-native-push-notification";

const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
};
const notificationHandler = (title, message, date) => {
  PushNotification.localNotificationSchedule({
    channelId: "channel-id",
    title: title,
    message: message,
    autoCancel: true,
    subText: "Notification",
    vibrate: true,
    vibration: 1000,
    playSound: true,
    soundName: "default",
    ignoreInForeground: false,
    importance: "high",
    invokeApp: true,
    allowWhileIdle: true,
    priority: "high",
    visibility: "public",
    date: date,
    repeatType: "day",
  });
};
const smallNotifications = (title, message, date) => {
  PushNotification.localNotificationSchedule({
    channelId: "channel-id",
    title: title,
    message: message,
    autoCancel: true,
    subText: "Notification",
    vibrate: true,
    vibration: 300,
    playSound: true,
    soundName: "default",
    ignoreInForeground: false,
    importance: "high",
    invokeApp: true,
    allowWhileIdle: true,
    priority: "high",
    visibility: "public",
    date: new Date(date),
    repeatType: "day",
  });
};
const cancelNotifications = (id) => {
  PushNotification.cancelLocalNotifications({ id: id });
};

// export {
//   createChannel,
//   notificationHandler,
//   smallNotifications,
//   cancelNotifications,
// };
