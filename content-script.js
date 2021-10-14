const USERCONTENTKEY = "saved-content";
let prevSelected = "";

const getStorageValPromise = (key) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (res) => {
      resolve(res[USERCONTENTKEY] === undefined ? "" : res[USERCONTENTKEY]);
    });
  });
};

const copyText = async () => {
  let selected = window.getSelection().toString();
  if (selected === "") {
    return;
  }
  selected = selected.trim();
  let previous;
  previous = await getStorageValPromise(USERCONTENTKEY);
  console.log(`selected is ${selected}`);
  const newContent = previous + selected + "\n";
  chrome.storage.sync.set(
    {
      [USERCONTENTKEY]: newContent,
    },
    () => {
      if (chrome.runtime.error) {
        console.log("encountered runtime error");
      } else {
        console.log("Value set to", newContent);
      }
    }
  );
  let curr;
  curr = await getStorageValPromise(USERCONTENTKEY);
  console.log("testing");
  console.log(`curr is ${curr}`);
};

const closeTooltip = (e) => {
  console.log("closed");
  // dont close the tooltip if they clicked on the copy button
  if (e.target.id === "copy-button") {
    return;
  }
  $("#copy-tooltip").remove();
};

const createTooltip = (e) => {
  const selected = window.getSelection().toString();
  // if there is no selected text, dont add anything to the doc
  if (selected === "" || prevSelected === selected) {
    return;
  }
  prevSelected = selected;
  const xAxis = e.pageX;
  const yAxis = e.pageY;
  const copyButton = $("<button/>", {
    id: "copy-button",
    text: "Copy",
    click: copyText,
  });
  const closeButton = $("<button/>", {
    id: "close-button",
    text: "Close",
    click: closeTooltip,
  });
  const copyTooltip = $("<div>").css({
    position: "absolute",
    left: `${xAxis}px`,
    top: `${yAxis}px`,
  });
  copyTooltip.attr("id", "copy-tooltip");
  copyTooltip.append(copyButton);
  copyTooltip.append(closeButton);
  $("body").append(copyTooltip);
  return;
};
document.addEventListener("mouseup", createTooltip);
document.addEventListener("mousedown", closeTooltip);
