// toastUtil.ts
import { toast } from "react-hot-toast";

export const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
    default:
      toast(message);
      break;
  }
};
