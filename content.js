console.log('Content: Initial content script loaded in frame:', window.location.href);

chrome.storage.sync.get(['autoRemove'], (result) => {
  const autoRemove = result.autoRemove || false;
  console.log('Content: Auto remove enabled:', autoRemove);

  if (autoRemove) {
    removeMaskPanel();
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