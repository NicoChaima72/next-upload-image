import axios from "axios";
import Error from "next/error";
import { SyntheticEvent, useState } from "react";

export default function Index() {
  const [file, setFile] = useState("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileSelect = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error: any) {
      console.log("There was an error uploading the file", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="bg-white border rounded shadow-lg mb-10">
      <div className="border-b p-3">
        <h5 className="font-bold uppercase text-gray-600">File</h5>
      </div>
      <div className="flex flex-row items-center p-3">
        <form onSubmit={handleSubmit} className="mr-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="mb-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            name="csv"
            onChange={handleFileSelect}
          />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
            Text file only.
          </p>
          <button className="border p-2" type="submit">
            Upload
          </button>
        </form>
        {isUploading && <div className="pl-4">uploading</div>}
      </div>
    </section>
  );
}
