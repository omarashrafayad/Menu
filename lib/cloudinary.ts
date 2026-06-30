import axios from "axios";

export async function uploadImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    "restaurant-menu"
  );

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/dqdwjumwk/image/upload`,
    formData
  );

  return data.secure_url;
}