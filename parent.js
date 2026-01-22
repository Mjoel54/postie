  const iframe = document.getElementById("childFrame");
      const messagesDiv = document.getElementById("messages");

      // Listen for messages from child
      window.addEventListener("message", (event) => {
        // Validate the origin - only accept messages from same origin
        const expectedOrigin = window.location.origin;
        if (event.origin !== expectedOrigin) {
          console.log("Ignored message from unexpected origin:", event.origin);
          return;
        }

        // Only respond to messages from our child iframe (not extension messages)
        if (!event.data || typeof event.data !== "object" || !event.data.subject) {
          console.log("Ignored message without expected structure:", event.data);
          return;
        }

        // Only respond to child-to-parent messages (not responses)
        if (event.data.subject === "response") {
          console.log("Ignored response message (preventing loop)");
          return;
        }

        console.log("Parent received:", event.data);

        messagesDiv.innerHTML += `<p>Message received from child iframe: ${JSON.stringify(event.data)}</p>`;

        // Send response back to child
        event.source.postMessage(
          {
            subject: "response",
            data: "Hello back from parent!",
          },
          event.origin,
        );
      });