import React, { useState } from "react";
import backgroundImage from "../../components/img/background.svg";
import Header from "../../components/Home/Header";
import axios from "axios";


const BASE_URL = 'https://file-service.manojshivagange.tech'; // Update with your backend upload URL
const PDF_SERVICE_URL = 'https://pdf-service.manojshivagange.tech'; // Update with your PDF service URL

// Function to initiate the file upload
async function initiateFileUpload(file) {
  const uploadRequest = {
    hash: '12345abcde', // You may calculate a real hash here if needed
    name: file.name,
    size: file.size
  };

  try {
    const response = await axios.post(`${BASE_URL}/upload/initiate`, uploadRequest);
    console.log('Initiate file upload response:', response.data);
    return response.data.eTag;  // Returns the eTag identifier
  } catch (error) {
    console.error('Error initiating file upload:', error.response?.data);
    return null;
  }
}

// Function to upload file chunks
async function uploadFileChunk(identifier, file) {
  const CHUNK_SIZE = 1024 * 1024; // 1 MB
  let currentByte = 0;

  while (currentByte < file.size) {
    const end = Math.min(currentByte + CHUNK_SIZE, file.size);
    const chunk = file.slice(currentByte, end); // Get the current chunk

    const contentRange = `bytes ${currentByte}-${end - 1}/${file.size}`;

    try {
      const response = await axios.put(
          `${BASE_URL}/upload/${identifier}`,
          chunk,
          {
            headers: {
              'Content-Range': contentRange,
              'Content-Type': file.type // Set content type for chunk
            }
          }
      );
      console.log(`Uploaded chunk: ${contentRange}, Response: ${response.status}`);
    } catch (error) {
      console.error(`Error uploading chunk ${contentRange}:`, error.response?.data);
      return;
    }

    currentByte += CHUNK_SIZE;
  }

  console.log('File upload completed.');
}

async function mergePDF(etag, password) {
  try {
    const resp = await axios.post(`${PDF_SERVICE_URL}/secure`, {
      etags: [etag],
      userPassword: password
    });

    console.log('Merge PDF response:', resp.data);
    return resp.data; // Assuming it contains the PDF URL or similar info
  } catch (error) {
    console.error('Error merging PDFs:', error.response?.data);
    return null;
  }
}

function ProtectPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handlePasswordChange = (event) => {
    const pwd = event.target.value;
    setPassword(pwd);
    evaluatePasswordStrength(pwd); // Call function to check password strength
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const evaluatePasswordStrength = (pwd) => {
    const strengthCriteria = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /[0-9]/.test(pwd),
      /[!@#$%^&*]/.test(pwd),
    ];
    const strengthCount = strengthCriteria.filter(Boolean).length;
    const strengthLevels = ["Weak", "Fair", "Good", "Strong"];
    setPasswordStrength(
      strengthCount > 0 ? strengthLevels[strengthCount - 1] : ""
    ); // Get strength level
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match. Please try again.");
      return;
    }




    try {
      let identifier = await initiateFileUpload(file);
      if (!identifier) {
        alert("Failed to initiate file upload");
        return;
      }
      uploadFileChunk(identifier, file);

      const data = await mergePDF(identifier, password);

      let downloadURL = `${BASE_URL}/download/${data[0]}`;

      const anchor = document.createElement('a');
      anchor.href = downloadURL;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setConvertedFileUrl(downloadURL);


    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error processing your request.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start min-h-screen bg-cover bg-no-repeat pt-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Header />
      <div className="flex flex-col items-center">
        <h2 className="text-5xl font-bold mt-20 mb-6 text-gray-800">
          Protect PDF
        </h2>
        <h3 className="text-2xl mt-0 mb-10 text-gray-800">
          Encrypt your PDF with a password to keep sensitive data confidential.
        </h3>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
        />

        <label
          htmlFor="fileInput"
          className="mt-3 bg-blue-500 text-white px-20 py-8 rounded-lg cursor-pointer hover:bg-blue-600 transition ease-in-out duration-300 text-xl"
        >
          Click to Select PDF File
        </label>

        {file && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">Selected File: {file.name}</p>
          </div>
        )}

        {/* Password Input */}
        <div className="mt-6 relative w-80">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            className="border-2 border-gray-300 p-3 pl-5 pr-10 rounded-lg w-full"
            aria-label="Password"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {showPassword ? (
                <path d="M12 4c4.5 0 9 4.5 9 8s-4.5 8-9 8-9-4.5-9-8 4.5-8 9-8zm0 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" />
              ) : (
                <path d="M12 4c4.5 0 9 4.5 9 8s-4.5 8-9 8-9-4.5-9-8 4.5-8 9-8zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
              )}
            </svg>
          </span>
        </div>
        {passwordStrength && (
          <div className="mt-2 text-gray-600">
            <strong>Password Strength:</strong> {passwordStrength}
          </div>
        )}

        {/* Confirm Password Input */}
        <div className="mt-3 relative w-80">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="border-2 border-gray-300 p-3 pl-5 pr-10 rounded-lg w-full"
            aria-label="Confirm Password"
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {showConfirmPassword ? (
                <path d="M12 4c4.5 0 9 4.5 9 8s-4.5 8-9 8-9-4.5-9-8 4.5-8 9-8zm0 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" />
              ) : (
                <path d="M12 4c4.5 0 9 4.5 9 8s-4.5 8-9 8-9-4.5-9-8 4.5-8 9-8zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
              )}
            </svg>
          </span>
        </div>

        <button
          onClick={handleUpload}
          className="mt-8 bg-green-500 text-white px-20 py-3 rounded-lg hover:bg-green-600 transition ease-in-out duration-300 text-xl"
        >
          Protect PDF
        </button>

        {convertedFileUrl && (
          <div className="mt-10 bg-blue-500 text-white px-10 py-5 rounded-lg cursor-pointer hover:bg-blue-600 transition ease-in-out duration-300 text-xl">
            <a
              href={convertedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Protected PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProtectPDF;
