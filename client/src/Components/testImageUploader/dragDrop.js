import { useState, useRef, useEffect } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dragDrop.css";

function DragDrop() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isRecieved, setIsRecieved] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();
  const [resultPositive, setResultPositive] = useState(0);
  const [resultNegative, setResultNegative] = useState(0);
  const [isDrapAndDrop, setIsDragAndDrop] = useState(false);
  const [isValidFileFormat, setIsValidFormat] = useState(true)
  const [isUploadClicked, setIsUploadClicked] = useState(false)

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragAndDrop(true);
    const file = event.dataTransfer.files[0];

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setIsDragAndDrop(false);
  };

  
  const handleUpload = async (event) => {
    event.preventDefault();
    setIsUploadClicked(true)
    const formData = new FormData();
    formData.append("file", file);
    console.log(file)
    try {
      const response = await fetch("http://localhost:5000/upload-image", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        
        .then((data) => {
          setResults(data.predicted_value[0]);
          setIsRecieved(true);
        });

     
    } catch (error) {
      
      setIsValidFormat(false)
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragAndDrop(false);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelFile = () => {
    setResultNegative("");
    setResultPositive("");
    setFile("");
    setIsRecieved(false);
    setIsDragAndDrop(false);
    setIsUploadClicked(false)
    setIsValidFormat(true)
  };

  useEffect(() => {
    if (results !== undefined) {
      setResultPositive(results[0] !== undefined ? results[0].toFixed(2) : "");
      setResultNegative(results[1] !== undefined ? results[1].toFixed(2) : "");
    }
  }, [results]);

  if (file)
    return (
      <>
       {!isValidFileFormat &&( <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
      <div className="btnCloseText">Warning: Only images files such as png, jpeg, jpg are accepted </div> 
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={cancelFile}
          ></button>
        </div>)}
        <div className="card">
          <div className="uploads">
            <div className="imageFrame">
              {preview && <img src={preview} alt="Preview" />}
            </div>
            
            <div className="card-body">
              <div class="row">
                {isRecieved &&
                  (resultPositive > resultNegative ? (
                    <div className="resultTextPositive">
                      Image isn't a Deepfake, {resultPositive * 100}% Confident{" "}
                    </div>
                  ) : (
                    <div className="resultTextNegative">
                      Image is a Deepfake, {resultNegative * 100}% Confident
                    </div>
                  ))}
                  {!isRecieved && isUploadClicked &&(
                    <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>)
                  }
              </div>
            </div>
          </div>
          <ul className="card-body">
            <li className="fileName">File Name: {file.name}</li>
          </ul>
          <div className="cancelUploadButton">
            <button type="button" className="button" onClick={cancelFile}>
              Cancel
            </button>

            <button type="button" className="button" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div
        className={`dropZone ${isDrapAndDrop ? "borderHighLight" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i class="bi bi-file-arrow-up"></i>
        <h1>Drag and Drop your image to Upload</h1>
        <h1>Or</h1>
        <input
          type="file"
          onChange={handleFileChange}
          hidden
          accept="image/png, image/jpeg"
          ref={inputRef}
        />
        <button
          onClick={() => inputRef.current.click()}
          className="selecectFileButton"
        >
          Select Files
        </button>
      </div>
    </>
  );
}

export default DragDrop;
