# AI Group Chat Controller (Deepseek + ChatGPT + Gemini)

This Python script uses Selenium and `undetected-chromedriver` to automate interactions between Deepseek, ChatGPT, and Gemini AI chat interfaces within a single browser window. It can automatically copy completed responses and (optionally) relay messages between the AIs based on formatted clipboard commands.

---

## Features ✨

* **Multi-AI Support:** Works with Deepseek, ChatGPT, and Gemini tabs.
* **Persistent Login:** Uses a dedicated Chrome profile (`--user-data-dir`) via `undetected-chromedriver` to keep you logged in across sessions.
* **Auto-Copy Responses:** Monitors the active AI tab (when in command mode) or all specified AI tabs (logic can be adapted) for completed responses and automatically copies them to the clipboard, prefixed with the AI's name (e.g., `Gemini: response text`). Handles streaming text stabilization for Deepseek and Gemini.
* **(Optional) Command Mode:** Monitors the system clipboard for specifically formatted text (`[ Conversation till AI_NAME's last message : message_to_send ]`). When detected, it sends the `message_to_send` to the specified `AI_NAME`'s chat input.
* **Focused Workflow:** When a command is sent, the script focuses on the target AI's tab, waits for the response, copies it, and then resumes monitoring the clipboard.
* **Minimal Intrusion:** Opens the browser in a narrow vertical strip on the left side of the screen to minimize disruption.
* **Clean Exit:** Uses `try...finally` to ensure the browser closes properly and releases resources when you stop the script with `Ctrl+C`.

---

## Requirements 🛠️

* **Python 3:** (Tested with 3.10+)
* **Google Chrome:** Must be installed on your system.
* **Python Libraries:**
    * `selenium`
    * `undetected-chromedriver`
    * `pyperclip`

---

## Setup ⚙️

1.  **Install Python & Chrome:** If you haven't already, install Python 3 and Google Chrome for your operating system (Linux/Windows).
2.  **Install Libraries:** Open your terminal or command prompt and run:
    ```bash
    pip install selenium undetected-chromedriver pyperclip
    ```
3.  **Prepare Script:** Save the Python script (e.g., `ai_controller.py`).
4.  **First-Time Profile Setup:**
    * Run the script for the first time: `python ai_controller.py`
    * An `undetected-chromedriver` window will open. **Manually log in** to Deepseek, ChatGPT, and Gemini in this specific browser window.
    * Once logged in to all services, you can **close the browser window**. The script will create a profile folder (e.g., `chrome-profile-uc`) in your user's home directory to store these login sessions.

---

## Usage 🚀

1.  **Open Tabs:** Make sure you have tabs open for Deepseek, ChatGPT, and Gemini in *any* regular Chrome window (the script will open its *own* window using the profile).
2.  **Run the Script:** Open your terminal/command prompt, navigate to the script's directory, and run:
    ```bash
    python ai_controller.py
    ```
3.  **Choose Mode:** The script will ask if you want to enable clipboard monitoring for the AI-to-AI group chat (Command Mode).
    * Type `y` and press Enter to enable **both** Command Mode and Auto-Copy.
    * Type `n` and press Enter to enable **only** Auto-Copy (it will monitor and copy responses but won't act on clipboard commands). *Note: The current focused script exits if 'n' is chosen; you might adapt this if you want passive auto-copy.*
4.  **Positioning:** The script will automatically open its controlled Chrome window and resize/position it to the left side of your screen.
5.  **Operation (Command Mode - 'y'):**
    * The script primarily monitors the clipboard.
    * Use your external tool or workflow to copy text in the format `[ Conversation till AI_NAME's last message : message_to_send ]` onto the clipboard.
    * The script will detect this, switch to the `AI_NAME` tab in *its controlled browser*, paste the `message_to_send` into the input field, and send it.
    * It will then wait on that tab, monitoring for the response to complete.
    * Once complete and stable, it copies the response (formatted `AI_NAME: response text`) to the clipboard.
    * It then resumes monitoring the clipboard for the next command.
6.  **Stop the Script:** Go back to the terminal where the script is running and press `Ctrl+C`. The script will shut down the browser cleanly.

---

## Configuration & Notes 📝

* **Selectors:** The CSS selectors for various elements (input boxes, stop buttons, response areas) are defined at the top of the script. If Deepseek, ChatGPT, or Gemini significantly change their website structure, these selectors might need to be updated by inspecting the elements in your browser's developer tools.
* **Window Size:** The window width (`window_width = 273`) and height (`window_height = 768`) are set near the beginning. You can adjust these values.
* **Polling Interval:** The script checks the clipboard and AI status every `2` seconds (defined by `time.sleep(2)` at the end of the main loop). You can adjust this, but shorter intervals increase CPU/RAM usage.
* **Clipboard Overwriting:** When sending a message (in Command Mode), the script temporarily overwrites your system clipboard to paste the message. The final AI response is then placed on the clipboard.
* **`undetected-chromedriver` Downloads:** This library might download components when the script starts to ensure compatibility with your current Chrome version and apply stealth patches. This is normal.

---

Enjoy your automated AI group chat! 🎉
