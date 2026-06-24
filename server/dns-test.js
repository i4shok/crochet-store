const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.istxwz8.mongodb.net",
  (err, records) => {
    console.log("SRV ERROR:");
    console.log(err);

    console.log("SRV RECORDS:");
    console.log(records);
  }
);