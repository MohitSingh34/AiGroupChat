AI Group Chat Controller (Deepseek + ChatGPT + Gemini)
This Python script uses Selenium and undetected-chromedriver to automate interactions between Deepseek, ChatGPT, and Gemini AI chat interfaces. It can automatically copy completed responses and (optionally) relay messages between the AIs based on formatted clipboard commands, enabling a "group chat" between them.
Features ✨
Multi-AI Support: Works seamlessly with Deepseek, ChatGPT, and Gemini tabs.
Persistent Login: Uses a dedicated Chrome profile to keep you logged in across sessions. No more manual logins!
Auto-Copy Responses: Monitors for completed responses and automatically copies them to the clipboard, prefixed with the AI's name (e.g., Gemini: response text).
(Optional) Command Mode: Monitors the clipboard for formatted commands ([ Conversation till AI_NAME's last message : message_to_send ]) and relays messages to the correct AI, creating a conversation loop.
Focused Workflow: When a command is sent, the script focuses only on the target AI's tab until the response is generated and copied, minimizing unnecessary tab switching.
Minimal Intrusion: Opens the browser in a narrow vertical strip on the left side of the screen to stay out of your way.
Clean & Safe Exit: Guaranteed cleanup on exit (Ctrl+C) to close the browser and free up system RAM.
Setup ⚙️
Follow these steps carefully to ensure a smooth setup.
Step 1: Create a Virtual Environment (Highly Recommended)
Using a virtual environment (venv) keeps your project's dependencies isolated from your system's Python, preventing conflicts and errors.
Open your terminal or command prompt and navigate to your project folder.
Create the virtual environment:
python3 -m venv venv

(On Windows, you might use python instead of python3)
Activate the virtual environment:
On Linux (like your Xubuntu) or macOS:
source venv/bin/activate

Your terminal prompt should now start with (venv).
On Windows:
.\venv\Scripts\activate

Your command prompt should now start with (venv).
All subsequent commands should be run inside this activated environment.
Step 2: Install Requirements
With your virtual environment active, install the necessary Python libraries.
pip install selenium undetected-chromedriver pyperclip


Step 3: First-Time Profile Setup
The script needs a dedicated Chrome profile to store your login sessions.
Run the script for the first time:
python ai_controller.py


An undetected-chromedriver window will open. Manually log in to Deepseek, ChatGPT, and Gemini in this specific browser window.
Once logged in to all services, you can close the browser window. The script will have created a profile folder (e.g., chrome-profile-uc) in your user's home directory.
Usage 🚀
Activate Environment: Make sure your virtual environment is active (source venv/bin/activate or .\venv\Scripts\activate).
Run the Script: In your terminal, run:
python ai_controller.py


