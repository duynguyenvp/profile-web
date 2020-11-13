import React, { useState, useEffect } from "react";
import { PopupContext } from "../../services/popupService";
import { addAlert } from "../../services/alertService";
import getApiInstance from "../../ajax/generic-api";
import "./style.scss";

const ImageItem = ({
  src, callback, remove, isSelected
}) => {
  const avatarStyle = {
    backgroundImage: `url("${
      src || require("../../assets/images/imageDefault.jpg")
    }")`
  };
  const handleRemove = e => {
    e.preventDefault();
    e.stopPropagation();
    remove();
  };

  const getPreviewElement = () => {
    let previewContainer = document.getElementById("preview-container");
    if (!previewContainer) {
      previewContainer = document.createElement("div");
      previewContainer.setAttribute("id", "preview-container");
      previewContainer.setAttribute("class", "preview-container");

      previewContainer.innerHTML = '<span class="close">&times;</span><img class="preview-container-content" id="img01"><div id="caption"></div>';

      document.body.appendChild(previewContainer);
    }
    const span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    const closePreview = () => {
      previewContainer.style.display = "none";
    };
    span.addEventListener("click", closePreview);
    previewContainer.addEventListener("click", closePreview);
    return previewContainer;
  };

  const handlePreview = () => {
    const modal = getPreviewElement();
    const modalImg = modal.querySelector("#img01");
    // const captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = src;
    // captionText.innerHTML = this.alt;
  };
  return (
    <div
      className={`image-item ${isSelected ? "selected" : ""}`}
      style={avatarStyle}
      onClick={callback}
    >
      <div className="preview-image" onClick={handlePreview}>
        <i className="material-icons">zoom_in</i>
      </div>
      <div className="icon-remove" onClick={handleRemove} />
    </div>
  );
};

const ImagePopup = props => {
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");
  const { callback } = props;

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/Image"
      })
      .then(res => {
        if (res && res.successful) {
          setImages(res.result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const readAsDataURL = file => new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.onload = async () => resolve({
      data: fileReader.result,
      name: file.name,
      size: file.size,
      type: file.type
    });

    fileReader.readAsDataURL(file);
  });

  const uploadImage = base64image => {
    getApiInstance()
      .uploadBase64Image({
        base64image
      })
      .then(res => {
        const { successful, src, error } = res || {};
        if (successful) {
          setSelected(src);
          loadImages();
        } else {
          addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
        }
      })
      .catch(error => {
        addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
      });
  };

  const handleImageChange = async event => {
    const files = [...event.target.files];

    if (files && files.length) {
      const file = files[0];
      const imageResult = await readAsDataURL(file);
      uploadImage(imageResult.data);
    }
  };

  const handleImageRemove = img => {
    getApiInstance()
      .deleteImage(img)
      .then(res => {
        const { successful, error } = res;
        if (successful) {
          loadImages();
          if (img.path === selected) {
            setSelected(null);
          }
        } else {
          addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
        }
      })
      .catch(error => {
        addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
      });
  };

  const handleImageSelected = img => {
    setSelected(img.path);
  };

  const testImage = (url, timeoutT) => new Promise((resolve, reject) => {
    const timeout = timeoutT || 5000;
    let timer;
    const img = new Image();
    function error() {
      clearTimeout(timer);
      reject(new Error("error"));
    }
    img.onerror = error;
    img.onabort = error;
    img.onload = function () {
      clearTimeout(timer);
      resolve("success");
    };
    timer = setTimeout(() => {
      // reset .src to invalid URL so it stops previous
      // loading, but doens't trigger new load
      img.src = "//!!!!/noexist.jpg";
      reject(new Error("timeout"));
    }, timeout);
    img.src = url;
  });

  const handleUploadFromUrl = () => {
    if (!url) {
      addAlert({ type: "error", message: "Url đang trống." });
      return;
    }

    testImage(url)
      .then(res => {
        if (res === "success") {
          getApiInstance()
            .uploadImageFromUrl({
              url
            })
            .then(res => {
              const { successful, src, error } = res || {};
              if (successful) {
                setSelected(src);
                loadImages();
              } else {
                addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
              }
            })
            .catch(error => {
              addAlert({ type: "error", message: `Đã xảy ra lỗi. ${error}` });
            });
        } else {
          addAlert({
            type: "error",
            message: "Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn."
          });
          setUrl("");
        }
      })
      .catch(() => {
        addAlert({
          type: "error",
          message: "Không thể tải ảnh. Vui lòng kiểm tra lại dường dẫn."
        });
      });
  };

  const avatarStyle = {
    backgroundImage: `url("${
      selected || require("../../assets/images/imageDefault.jpg")
    }")`
  };
  return (
    <PopupContext.Consumer>
      {({ onClose }) => (
        <div className="image-popup-wrapper">
          <div className="image-popup-body">
            <div className="image-upload-area">
              <div className="image-selected" style={avatarStyle} />
              <label htmlFor="input-image" className="input-button">
                <i className="material-icons">cloud_upload</i>
                {" "}
                Upload ảnh mới
              </label>
              <input
                type="file"
                id="input-image"
                onChange={handleImageChange}
              />
              <div className="form-filter">
                <div className="filter-item">
                  <label className="title">Hoặc nhập link ảnh:</label>
                  <div className="input-container">
                    <input
                      type="text"
                      className=""
                      placeholder="Nhập đường dẫn ..."
                      value={url || ""}
                      onChange={e => {
                        setUrl(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="filter-item controls">
                  <button
                    className="btnPrimary margin-16px"
                    onClick={() => {
                      handleUploadFromUrl();
                    }}
                  >
                    Upload
                  </button>
                  <button
                    className="btnDanger"
                    onClick={() => {
                      setUrl("");
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
            <div className="list-images">
              <h3 style={{ width: "100%" }}>Danh sách ảnh đã upload</h3>
              <div className="list-images-item">
                {images
                  && images.map((item, index) => (
                    <ImageItem
                      key={index}
                      src={item.path}
                      isSelected={item.path === selected}
                      remove={() => {
                        handleImageRemove(item);
                      }}
                      callback={() => {
                        handleImageSelected(item);
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="filter-item flex-end">
            {selected && (
              <button
                className="btnPrimary margin-16px"
                onClick={() => {
                  callback(selected);
                  onClose();
                }}
              >
                Chọn
              </button>
            )}
            <button
              className="btnDefault"
              onClick={() => {
                onClose();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </PopupContext.Consumer>
  );
};
export default ImagePopup;
