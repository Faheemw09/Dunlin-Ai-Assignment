"use client";
import React, { useState } from "react";
import axios from "axios";
import "./globals.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [entities, setEntities] = useState(null);

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
      setFile(file);
    }
  };
  const handleUpload = async () => {
    setLoading(true);
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://dunlin-backend.onrender.com/api/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response?.data, "res");
      setEntities(response?.data);
      // setSummary(response.data.summary);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    }
  };
  // console.log(entities, "eb");
  return (
    <>
      <div className="flex items-center justify-center mt-4">
        <div className="container mx-auto p-4 border border-solid border-gray-300 bg-white-600 #faf9fa; items-center flex flex-col ">
          <div className="headerLine">
            <h1 className="text-2xl font-bold mb-4">
              AI-Powered Content Summarization and Analysis Tool
            </h1>
          </div>
          <div className="headerLine" />
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
                    <span class="font-semibold">Click to upload</span> or drag
                    and drop
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
            <Button onClick={handleUpload} className="btn" disabled={!file}>
              {loading ? "uploading..." : "Upload and Summarize"}
            </Button>
          </div>
        </div>
      </div>
      {entities && (
        <div className="flex items-center justify-center m-auto">
          {/* <Input /> */}
          <Tabs defaultValue="keywords" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="sentiments">Sentiments</TabsTrigger>
              <TabsTrigger value="topic">Topic Information</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiments">
              <TabsContent value="sentiments">
                <TabsContent value="sentiments">
                  {entities?.sentiment && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="mb-2">
                        <span className="font-bold text-blue-600">
                          Magnitude:
                        </span>
                        <span className="ml-2 text-gray-700">
                          {entities.sentiment.magnitude}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-green-600">Score:</span>
                        <span className="ml-2 text-gray-700">
                          {entities.sentiment.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </TabsContent>
            </TabsContent>
            <TabsContent value="topic">
              <div>
                {entities?.classifications?.map((ele, index) => (
                  <div key={index} className="mb-4">
                    <div className="bg-gray-100 border border-gray-300 rounded-sm p-2 text-sm">
                      Name: {ele?.name}
                    </div>
                    <div className="mt-2 text-gray-600">
                      Confidence: {ele?.confidence.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="keywords">
              <div className="flex flex-wrap  -mx-2 border border-gray-300 rounded-lg p-4 gap-3">
                {entities?.keywords?.map((ele, index) => (
                  // <div key={index} className="w-1/5 px-2 mb-4 ">
                  <div className="bg-gray-100 border   border-gray-300 rounded-sm p-2 text-sm">
                    {ele}
                  </div>
                  // </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default HomePage;
