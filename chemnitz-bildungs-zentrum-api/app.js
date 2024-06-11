import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
const app = express();
const port = 3000;
import cors from "cors";
import school from "./routes/school.routes.js";
import user from "./routes/user.routes.js";
import facility from "./routes/facility.routes.js";
import user_favourite from "./routes/user_favourite.routes.js";
import user_auth from "./routes/user_auth.routes.js";
import authenticateToken from "./middlewares/authMiddleware.js";
import { get_sub_types } from "./controllers/facility.controller.js";

const mongoDbUrl = "mongodb://127.0.0.1:27017/chemnitz-bildungs-zentrum";
connect(mongoDbUrl);
console.log('Mongo connected');
app.use(cors());
app.use(json());
app.use(urlencoded({extended:true}));
app.use("/api/v1", user_auth);

app.use(authenticateToken);
app.use("/api/v1/schools", school);
app.use("/api/v1/users", user);
app.use("/api/v1/facilities", facility);
app.use("/api/v1/userFavourites", user_favourite);
app.get("/api/v1/facilities/subTypes", get_sub_types);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});