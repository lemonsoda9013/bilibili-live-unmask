console.log('Background: Service worker loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background: Received message:', request);
  if (request.action === 'removeMask') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        console.error('Background: No active tab found');
        sendResponse({ status: 'error', message: 'No active tab found' });
        return;
      }
      console.log('Background: Executing script in tab:', tabs[0].id);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id, allFrames: true },
        function: removeMaskPanel
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error('Background: Script execution error:', chrome.runtime.lastError.message);
          sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
        } else {
          console.log('Background: Script executed successfully');
          sendResponse({ status: 'success' });
        }
      });
    });
    return true; // 保持消息通道开放以支持异步响应
  } else {
    sendResponse({ status: 'error', message: 'Unknown operation' });
  }
});

function removeMaskPanel() {
  console.log('Content: Running removeMaskPanel in frame:', window.location.href);
  function removeElement() {
    const element = document.getElementById('web-player-module-area-mask-panel');
    console.log('Content: Found element:', element);
    if (element && element.parentNode) {
      console.log('Content: Removing element:', element);
      element.parentNode.removeChild(element);
    }
  }

  // 立即运行
  removeElement();

  // 设置 MutationObserver 以处理动态添加的元素
  const observer = new MutationObserver((mutations) => {
    console.log('Content: Mutation observed');
    removeElement();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
}