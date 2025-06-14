document.addEventListener('DOMContentLoaded', () => {
  const removeButton = document.getElementById('removeMask');
  const autoRemoveSwitch = document.getElementById('autoRemove');

  // 加载保存的自动移除状态
  chrome.storage.sync.get(['autoRemove'], (result) => {
    autoRemoveSwitch.checked = result.autoRemove || false;
    console.log('Popup: Loaded autoRemove state:', autoRemoveSwitch.checked);
  });

  // 保存自动移除状态
  autoRemoveSwitch.addEventListener('change', () => {
    const isChecked = autoRemoveSwitch.checked;
    chrome.storage.sync.set({ autoRemove: isChecked }, () => {
      console.log('Popup: Saved autoRemove state:', isChecked);
    });
  });

  // 手动移除按钮点击事件
  removeButton.addEventListener('click', () => {
    console.log('Popup: Sending removeMask message');
    chrome.runtime.sendMessage({ action: 'removeMask' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Popup: Error sending message:', chrome.runtime.lastError.message);
        alert('Failed to remove the mask: ' + chrome.runtime.lastError.message);
        return;
      }
      console.log('Popup: Received response:', response);
      if (response && response.status === 'success') {
        alert('Mask removed successfully!');
      } else {
        alert('Failed to remove the mask: ' + (response ? response.message : 'Unknown error'));
      }
    });
  });
});