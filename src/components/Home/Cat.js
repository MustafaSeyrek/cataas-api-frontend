import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Cat() {
  const backendUrl = "http://localhost:8080/api/cats";
  const catsApiUrl = "https://cataas.com/cat";
  //tag
  //"https://cataas.com/cat/cute";
  //text
  //https://cataas.com/cat/says/hello
  //wh
  //https://cataas.com/cat?width=500&height=500

  let anchor = document.createElement("a");
  const [cats, setCats] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [query, setQuery] = useState({
    tag: null,
    txt: null,
    w: null,
    h: null,
  });

  useEffect(() => {
    //loadCats();
  }, []);

  const onInputChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const loadCats = async () => {
    try {
      const result = await axios.get(backendUrl);
      setCats(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadFile = (result, name) => {
    let blobby = result.data;
    let objectUrl = window.URL.createObjectURL(blobby);
    anchor.href = objectUrl;
    anchor.download = name;
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
  };

  const onFileChange = (e) => {
    clearMessage();
    setSelectedFile(e.target.files[0]);
  };

  const clearMessage = () => {
    setError(null);
    setSuccess(null);
  };

  const uploadFile = async () => {
    clearMessage();
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (selectedFile != null) {
      try {
        const result = await axios.post(backendUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (result.data) setSuccess(result.data);
        loadCats();
      } catch (err) {
        if (err.response != null) setError(err.response.data);
        else setError(err.message);
      }
    } else {
      setError("Please select the file you want to upload!");
    }
  };

  const onSubmitTag = async (e) => {
    clearMessage();
    e.preventDefault();
    if (query.tag != null) {
      try {
        const result = await axios.get(catsApiUrl + "/" + query.tag, {
          responseType: "blob",
        });
        downloadFile(result, query.tag);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Tag cannot be allowed to be empty!");
    }
  };

  const onSubmitTxt = async (e) => {
    clearMessage();
    e.preventDefault();
    if (query.txt != null) {
      try {
        const result = await axios.get(catsApiUrl + "/says/" + query.txt, {
          responseType: "blob",
        });
        downloadFile(result, query.txt);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Text cannot be allowed to be empty!");
    }
  };

  const onSubmitWH = async (e) => {
    clearMessage();
    e.preventDefault(); 
    if (query.h == null && query.w == null) {
      setError("Width and height cannot be allowed to be empty!");
    } else {
      try {
        var temp = "width=" + query.w + "&height=" + query.h;
        if (query.h) temp = "height=" + query.h;
        if (query.w) temp = "width=" + query.w;
        const result = await axios.get(catsApiUrl + "?" + temp, {
          responseType: "blob",
        });
        downloadFile(result, "cat-" + temp);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div className="py-4">
          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            ""
          )}
          {success ? (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          ) : (
            ""
          )}

          {/* <form className="row g-2 mb-3">
            <div className="col-auto">
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => onFileChange(e)}
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => uploadFile()}
              >
                Upload
              </button>
            </div>
          </form> */}
          <form className="row g-2 mb-3" onSubmit={onSubmitTag}>
            <div className="form-group row mt-3">
              <label htmlFor="tag" className="col-auto col-form-label">
                Tag:
              </label>
              <div className="col-auto">
                <input
                  required
                  type="text"
                  className="form-control"
                  id="tag"
                  name="tag"
                  placeholder="Tag"
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  Submit Tag
                </button>
              </div>
            </div>
          </form>
          <form className="row g-2 mb-3" onSubmit={onSubmitTxt}>
            <div className="form-group row mt-3">
              <label htmlFor="txt" className="col-auto col-form-label">
                Text:
              </label>
              <div className="col-auto">
                <input
                  required
                  type="text"
                  className="form-control"
                  id="txt"
                  name="txt"
                  placeholder="Text"
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  Submit Text
                </button>
              </div>
            </div>
          </form>
          <form className="row g-2 mb-3" onSubmit={onSubmitWH}>
            <div className="form-group row mt-3">
              <label htmlFor="w" className="col-auto col-form-label">
                Width/Height:
              </label>
              <div className="col-auto">
                <input
                  type="number"
                  className="form-control"
                  id="w"
                  name="w"
                  placeholder="Width"
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col-auto">
                <input
                  type="number"
                  className="form-control"
                  id="h"
                  name="h"
                  placeholder="Height"
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary">
                  Submit Width/Height
                </button>
              </div>
            </div>
          </form>

          <table className="table border shadow">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Path</th>
                <th scope="col">Size</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat, index) => (
                <tr>
                  <th scope="row">{cat.id}</th>
                  <td>{cat.name}</td>
                  <td>{cat.type}</td>
                  <td>{cat.size}B</td>
                  <td>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => downloadFile(cat.code, cat.name)}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger mx-2"
                      //   onClick={() => (cat.code)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
