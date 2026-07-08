const listenToConnectionStateUpdates = (eventSource) => {
  const eventSourceStates = [
    {
      text: "Connecting",
      circleClassName: "connection-started",
    },
    {
      text: "Connected",
      circleClassName: "connection-stablished",
    },
    {
      text: "Error",
      circleClassName: "connection-closed",
    },
  ];

  const { text, circleClassName } = eventSourceStates[eventSource.readyState];
  const circleElement = document.getElementById("connection-state-circle");
  const textElement = document.getElementById("connection-state");

  const updateConnectionStateElements = () => {
    circleElement.classList.remove(
      eventSourceStates.map((state) => state.circleClassName),
    );

    const { text, circleClassName } = eventSourceStates[eventSource.readyState];
    textElement.innerText = text;
    circleElement.classList.add(circleClassName);
  };

  updateConnectionStateElements();
  eventSource.addEventListener("open", updateConnectionStateElements);
  eventSource.addEventListener("error", updateConnectionStateElements);
};

const listenToMessageChunkEvent = (eventSource) => {
  eventSource.addEventListener("notification", (event) => {
    if (event.data) {
      const messageContainer = document.createElement("div");
      messageContainer.className = "message-container"

      const labelSpan = document.createElement("span");
      labelSpan.className = "notification-label"
      labelSpan.textContent = "Notification: ";

      const textSpan = document.createElement("span");
      textSpan.className = "message";
      textSpan.textContent = event.data;

      messageContainer.appendChild(labelSpan)
      messageContainer.appendChild(textSpan)

      const messagesList = document.getElementById("messages-list");
      messagesList.style.display = "flex";
      messagesList.appendChild(messageContainer)
    }
  });
};

(function init() {
  const eventSource = new EventSource("http://localhost:80/stream");

  listenToConnectionStateUpdates(eventSource);
  listenToMessageChunkEvent(eventSource);
})();
