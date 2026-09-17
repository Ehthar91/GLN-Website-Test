GLN Bus Call — Teacher Receive Fix

Replace the existing bus-call.js in your GitHub repository root with this bus-call.js.

Fix:
- Restores the missing teacher presence function introduced by the Waiting for Caller update.
- Teachers may still join before the caller starts.
- When the caller comes online, the teacher automatically reconnects and receives regular and add-on bus calls.
- Teacher presence resets correctly when the live session returns to Waiting for Caller.
