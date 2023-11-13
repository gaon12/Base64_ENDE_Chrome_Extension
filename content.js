chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.action === "encode") {
        const encodedText = encode(msg.selectedText);
        if(encodedText == "dW5kZWZpbmVk") {
            showModal("Encoded Text", "The target could not be encoded. It looks like you are trying to encode an image or video.");
        } else {
            showModal("Encoded Text", encodedText);
        }
    } else if (msg.action === "decode") {
        if (isBase64(msg.selectedText)) {
            const decodedText = decode(msg.selectedText);
            showModal("Decoded Text", decodedText);
        } else {
            showModal("Error", "Selected text is not valid Base64 encoded.");
        }
    }
});

function encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function decode(str) {
    if (!isBase64(str)) {
        throw new Error('Invalid Base64 string');
    }
    return atob(str);
}

function isBase64(str) {
    const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Pattern.test(str);
}

function showModal(title, text) {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.style.backgroundColor = isDarkMode ? '#333' : '#f8f9fa';
    modal.style.color = isDarkMode ? '#fff' : '#212529';
    modal.style.padding = '20px';
    modal.style.borderRadius = '15px';
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modal.style.minWidth = '300px';
    modal.style.maxWidth = '500px';
    modal.style.transition = 'all 0.3s ease-in-out';

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    titleElement.style.marginBottom = '10px';
    modal.appendChild(titleElement);

    const textContainer = document.createElement('div');
    textContainer.style.maxHeight = '300px';
    textContainer.style.minHeight = '30px';
    textContainer.style.overflow = 'auto';
    textContainer.style.marginBottom = '20px';

    const textElement = document.createElement('p');
    textElement.textContent = text;
    if (/^https?:\/\//.test(text)) {
        const linkElement = document.createElement('a');
        linkElement.href = text;
        linkElement.textContent = text;
        linkElement.target = '_blank';
        linkElement.style.color = '#0000EE';
        textElement.textContent = '';
        textElement.appendChild(linkElement);
    } else {
        textElement.style.cursor = 'pointer';
        textElement.onclick = function () {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Text copied to clipboard', isDarkMode);
            });
        };
    }
    textContainer.appendChild(textElement);
    modal.appendChild(textContainer);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    applyButtonStyle(closeButton, isDarkMode);
    closeButton.onclick = function () {
        document.body.removeChild(modalBackground);
    };
    buttonContainer.appendChild(closeButton);

    modal.appendChild(buttonContainer);

    const modalBackground = document.createElement('div');
    modalBackground.className = 'custom-modal-background';
    modalBackground.style.position = 'fixed';
    modalBackground.style.top = 0;
    modalBackground.style.left = 0;
    modalBackground.style.width = '100%';
    modalBackground.style.height = '100%';
    modalBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modalBackground.style.display = 'flex';
    modalBackground.style.justifyContent = 'center';
    modalBackground.style.alignItems = 'center';
    modalBackground.style.zIndex = 10000;
    modalBackground.style.transition = 'opacity 0.3s ease-in-out';

    modalBackground.appendChild(modal);
    document.body.appendChild(modalBackground);

    modalBackground.addEventListener('click', function (event) {
        if (event.target === modalBackground) {
            document.body.removeChild(modalBackground);
        }
    });

    modal.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

function applyButtonStyle(button, isDarkMode) {
    button.style.padding = '10px 20px';
    button.style.backgroundColor = isDarkMode ? '#6c757d' : '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = 'background-color 0.3s ease-in-out';
    button.onmouseover = function () {
        this.style.backgroundColor = isDarkMode ? '#5a6268' : '#0056b3';
    };
    button.onmouseout = function () {
        this.style.backgroundColor = isDarkMode ? '#6c757d' : '#007bff';
    };
}

function showNotification(message, isDarkMode) {
    const notification = document.createElement('div');
    notification.style.backgroundColor = isDarkMode ? '#333' : '#323232';
    notification.style.color = isDarkMode ? '#fff' : 'white';

    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}