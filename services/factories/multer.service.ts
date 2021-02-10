import multer = require("multer");
import { NextFunction, Request, Response } from "express";
import { UnprocessableEntityException } from "../../exceptions/root/unprocessable-entity.exception";
import * as path from "path";
import * as fs from "fs";
import shelljs from "shelljs";
import { Helpers } from "../../util/helpers.util";

// const storage = multer.diskStorage({
//   destination: (req: Request, file, callback) => {
//     const type = req.body.type || "";
//     if (!type) {
//       callback(new UnprocessableEntityException(null), null);
//     }
//     const dir = `public/uploads/${type}`;
//     if (!fs.existsSync(dir)) {
//       shelljs.mkdir("-p", dir);
//     }
//     callback(null, `public/uploads/${type}`);
//   },
//   filename   : (req: Request, file, callback) => {
//     let name   = file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname);
//     name = Helpers.sanitizePath(name);
//     callback(null, name);
//   },
// });

const storage = multer.memoryStorage();

export const upload = multer({storage: storage});
