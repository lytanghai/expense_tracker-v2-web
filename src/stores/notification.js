import { ref } from "vue";

const show = ref(false);
const title = ref("Success");
const message = ref("");
const color = ref("bg-green-500"); // default green

function notify(type, msgTitle, msgText) {
  // type can be: success | update | delete
  if (type === "success" || type === "create") {
    color.value = "bg-green-500";
  } else if (type === "update") {
    color.value = "bg-blue-500";
  } else if (type === "delete") {
    color.value = "bg-red-500";
  }

  title.value = msgTitle;
  message.value = msgText;
  show.value = true;

  setTimeout(() => {
    show.value = false;
  }, 4000);
}

export function useNotification() {
  return { show, title, message, color, notify };
}
