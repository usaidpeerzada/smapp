import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import { Platform } from "react-native";

const ACCESS_PERMISSIONS = {
  android: PERMISSIONS.ANDROID.CAMERA,
};

const REQUEST_PERMISSION_TYPE = {
  camera: ACCESS_PERMISSIONS,
};

const PERMISSON_TYPE = {
  camera: "camera",
};

class AppPermission {
  checkPermission = async (type) => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permissions) {
      return true;
    }
    try {
      const approval = check(permissions);
      if (approval === RESULTS.GRANTED) return true;
      return this.requestPermission(permissions);
    } catch (err) {
      return false;
    }
  };
  requestPermission = async (permissions) => {
    try {
      const approval = await request(permissions);
      return (approval = RESULTS.GRANTED);
    } catch (err) {
      return false;
    }
  };
}

const Permission = new AppPermission();

export { Permission, PERMISSON_TYPE };
