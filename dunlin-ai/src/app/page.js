"use client";
import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./styles/main.module.css";
const HomePage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      "text/plain",
      "text/html",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file && !allowedTypes.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload a plain text, HTML, or DOCX file."
      );
      e.target.value = null;
    } else {
      setError("");
      onFileChange(e);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="container mx-auto p-4 border border-solid border-gray-300 bg-white-600 #faf9fa; items-center flex flex-col ">
      <div className="headerLine">
        <h1 className="text-2xl font-bold mb-4">
          AI-Powered Content Summarization and Analysis Tool
        </h1>
        </div>
        <div className="headerLine"/>
        <div className="upload-container mb-4 items-center flex flex-col gay-y-4 ">
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col w-14 items-center justify-center w-72 h-30 mb-5 border-2 #9800ed border-purple-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                Acceptable file types: Plain Text, HTML, DOC
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                onChange={handleFileChange}
                class="hidden"
              />
            </label>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          <button onClick={handleUpload} className="btn">
            Upload and Summarize
          </button>
        </div>
        {summary && (
          <div className="summary-container mt-4">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
