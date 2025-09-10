import dotenv from "dotenv";
import path from "path";

// dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "./Food_del_app/backend/.env") });

import ImageKit from "imagekit";


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_u55hkp2b6gTMdsAwT1G+wJKflNc=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_TMs1/ugiVg10a6OiIUWC4fEAA8s=" ,
  urlEndpoint:  process.env.IMAGEKIT_URL_ENDPOINT ||"https://ik.imagekit.io/spd77rulo" ,
});

export async function uploadFile(file, fileName) {
  return await imagekit.upload({
    file,
    fileName,
  });
}
