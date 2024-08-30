import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/room-selection", component: "room-selection" },
  { path: "/chat", component: "chat-page" },
]);
