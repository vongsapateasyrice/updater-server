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

const latestVersion = "0.5.0";

app.get("/:target/:arch/:current_version", (c) => {
  const { current_version, arch, target } = c.req.param();
  console.log("get version", current_version, arch, target);
  if (current_version >= latestVersion) {
    return c.body(null, 204);
  }
  return c.json({
    version: latestVersion,
    url: "http://localhost:3000/static/builds/0.5.0/bundle/dmg/test-tauri-updater_0.5.0_aarch64.dmg",
    signature:
      "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVRU2hwR0dSbWk5aDEzM1QwaENBVWhCSnVyS0xGdit2eEFlSWRmL1lGczM1Mmk5QUVOU1lBV0Q5ZHFyNFJQOXlYZlFwUWNiTlc0OS9raUZYTVZjaVZSV2I2NTlKa0YxeHdFPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzM3MjczMzA1CWZpbGU6dGVzdC10YXVyaS11cGRhdGVyLmFwcC50YXIuZ3oKWk91cnY5dHkwZ0w5WGRSWC9FV05OcERUL0pJWUtCTkdlWDI4SXFmUCs5aVMzd1lSL1ZFZlZ0a2w3UmkwNWFLRlMrSXhPYTE3MGZpUi9FdFdYVzE3Q0E9PQo=",
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
