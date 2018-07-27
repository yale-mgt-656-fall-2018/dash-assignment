FROM alekzonder/puppeteer:1.1.1
COPY ./grade-project-1.js /app/grade-project-1.js
COPY ./helpers.js /app/helpers.js
ENTRYPOINT ["dumb-init", "--", "node", "grade-project-1.js"]