import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/static/*", (c, next) => {
  console.log(`static requested ${c.req.url}`);
  return serveStatic({ root: "./" })(c, next);
});

const latestVersion = "0.1.0";

app.get("/:target/:arch/:current_version", (c) => {
  const { current_version, arch, target } = c.req.param();
  console.log("get version", current_version, arch, target);
  if (current_version >= latestVersion) {
    return c.body(null, 204);
  }
  return c.json({
    version: "0.3.0",
    url: "http://localhost:3000/static/builds/0.3.0/bundle/macos/test-tauri-updater.app",
    signature:
      "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRU2hwR0dSbWk5aDcyTUd5bWVjUndBS2VodE8wUGV6ZGZYeWNnbjdYODlHQS94MGVvRnE0c05NV0gyQnZvOCs5Y0lra3dlVENVNkJIU0VMMCt2R3dWcHZoRi9oTWlSY0EwPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzM3MTAxODg0CWZpbGU6dGVzdC10YXVyaS11cGRhdGVyLmFwcC50YXIuZ3oKNXprRXYwUDhyYlUvK3FwbXNZQ29Ca1ZSd3BrN25ja0xkUVB4VXV3NnNSazVXcmZLMjExblYvTDN0QzYwVTVDWWJrY1BiRlBJTE9ncDBUaFJLNm9HQUE9PQo=",
  });
});

app.get("*", (c) => {
  return c.text(c.req.raw.url);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
