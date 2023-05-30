import React, { useState } from "react";

function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
console.log("preview", preview)
console.log("FIle", file)
  const handleSubmit = (e) => {
    e.preventDefault();
    // code to submit the file to the server
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // if (!file) {
    //   return;
    // }
  
     
   // const file = e.target.files[0];
   const formData = new FormData();
    formData.append('image', file);
    console.log("this is the file ", formData)
    const response = await fetch('http://127.0.0.1:5000/', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileInputChange} />
      {preview && <img src={preview} alt="Preview" />}
      <button type="submit" onClick={handleFormSubmit}>Upload</button>
    </form>
  );
}

export default ImageUploader;
