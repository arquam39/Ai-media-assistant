import "dotenv/config";

import dns from "dns";
import app from "./app.js";
import connectDB from "./config/db.js";


// =========================
// DNS
// =========================

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


// =========================
// Server
// =========================

const PORT =
    process.env.PORT || 5000;


const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {

        console.log(
            `Server running on port ${PORT}`
        );

    });

};


startServer();