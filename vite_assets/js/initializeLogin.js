import * as kg from "urbit-key-generation";
import * as ob from "urbit-ob";
import { ethers } from "ethers";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("urbitLoginForm");
  const loginUrl = loginForm.dataset.loginUrl;
  const indexUrl = loginForm.dataset.indexUrl;
  const challenge = loginForm.dataset.challenge;
  console.log(loginUrl);

  const urbitIdInput = document.getElementById("urbitId");
  const masterTicketInput = document.getElementById("masterTicket");

  // Function to validate Urbit ID (patp)
  function validateUrbitId(input) {
    const isValid = ob.isValidPatp(input);
    urbitIdInput.classList.toggle("border-red-500", !isValid);
    return isValid;
  }

  // Function to validate Master Ticket (placeholder)
  function validateMasterTicket(input) {
    // TODO: Implement proper validation logic for Master Ticket
    const isValid = input.length > 0; // Placeholder validation
    masterTicketInput.classList.toggle("border-red-500", !isValid);
    return isValid;
  }

  // Add input event listeners for real-time validation
  urbitIdInput.addEventListener("input", function () {
    validateUrbitId(this.value);
  });

  masterTicketInput.addEventListener("input", function () {
    validateMasterTicket(this.value);
  });

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const urbitId = urbitIdInput.value;
    const masterTicket = masterTicketInput.value;

    // Validate inputs before proceeding
    if (!validateUrbitId(urbitId) || !validateMasterTicket(masterTicket)) {
      alert("Please enter valid Urbit ID and Master Ticket.");
      return;
    }

    const point = ob.patp2dec(urbitId);
    console.log(point);

    try {
      // Initialize ethers provider using Infura API key
      const network = process.env.ETHEREUM_NETWORK || "sepolia";
      const provider = new ethers.JsonRpcProvider(
        `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
      );

      // Generate the ownership wallet using urbit-key-generation
      const hdWallet = await kg.generateWallet({
        ticket: masterTicket,
        ship: point,
      });
      if (!hdWallet) {
        console.log("Error generating Urbit HD Wallet from master ticket");
        return;
      }

      // Create a signature using the master ticket, urbit ID, and the provided challenge
      const publicKey = hdWallet.ownership.keys.public;
      const privateKey = hdWallet.ownership.keys.private;
      const wallet = new ethers.Wallet(privateKey);

      // Sign the challenge message
      // TODO: hash challenge before signing?
      const signature = await wallet.signMessage(challenge);
      console.log(signature);

      // Send the login request to the server
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
          urbitId: urbitId,
          signature: signature,
          challenge: challenge,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.success) {
          // Render the content or redirect to the next page
          // For example, redirect to the home page
          window.location.href = data.redirectUrl || "/";
        } else {
          console.error("Login failed:", data.message);
          alert("Login failed. Please try again.");
        }
      } else {
        console.error("Failed to send login request:", response.statusText);
        alert("Failed to send login request. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  });
});

// Remove the local signMessage function as we're now importing it
