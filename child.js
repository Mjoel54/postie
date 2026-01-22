const responseDiv = document.getElementById("response");
// Reference to the parent window as recommended by IMS Global in 2.1 Target window - https://www.imsglobal.org/spec/lti-cs-pm/v0p1#lti-client-side-postmessages
const targetWindow = window.parent || window.opener;

const button = document.getElementById("sendBtn");

// Send a message to the targetWindow
button.addEventListener("click", () => {
  targetWindow.postMessage(
    {
      subject: "greeting (in practice something like this '{subject: 'lti.capabilities'}, '*'')", // Changed from 'type' to 'subject'
      message_id: crypto.randomUUID(), // Add unique message_id
      data: "Hello from iframe!", // Your custom data
    },
    window.location.origin,
  ); // Send to same origin as current page
});

// Listen for responses from targetWindow
window.addEventListener("message", (event) => {
  // Validate the origin - only accept messages from the targetWindow's origin
  const expectedOrigin = window.location.origin;
  if (event.origin !== expectedOrigin) {
    console.log("Ignored message from unexpected origin:", event.origin);
    return;
  }

  // Only process messages with expected structure
  if (!event.data || typeof event.data !== "object" || !event.data.subject) {
    console.log("Ignored message without expected structure:", event.data);
    return;
  }

  // Only process response messages from targetWindow
  if (event.data.subject !== "response") {
    console.log("Ignored non-response message:", event.data.subject);
    return;
  }

  console.log("Child received:", event.data);
  responseDiv.textContent = "Received: " + JSON.stringify(event.data);
});
