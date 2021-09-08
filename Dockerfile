FROM denoland/deno:1.13.2

EXPOSE 6363

WORKDIR /app

USER deno

COPY mod.js .
COPY auth.js .
RUN deno cache --unstable --no-check mod.js

CMD ["run", "--unstable", "--no-check", "--allow-env", "--allow-read", "--allow-write", "--allow-net", "mod.js"]