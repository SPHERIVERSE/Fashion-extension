// background.js

console.log("Background script loaded.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Fashion Comparison Extension installed.");
});
