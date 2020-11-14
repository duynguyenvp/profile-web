// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file

export default (url, callback, checkProp) => {
  // to check property is exist
  if (window[checkProp]) {
    callback();
    return;
  }
  // Adding the script tag to the head as suggested before
  const { head } = document;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  // Then bind the event to the callback function.
  // There are several events for cross browser compatibility.
  script.onreadystatechange = callback;
  script.onload = callback;

  // Fire the loading
  head.appendChild(script);
};
