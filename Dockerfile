FROM alekzonder/puppeteer:1.1.1
COPY ./grade.js /app/grade.js
ENTRYPOINT ["dumb-init", "--", "node", "grade.js"]