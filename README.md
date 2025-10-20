````markdown
# AI Group Chat Controller (Deepseek + ChatGPT + Gemini)

This Python script uses Selenium and `undetected-chromedriver` to automate interactions between Deepseek, ChatGPT, and Gemini AI chat interfaces. It can automatically copy completed responses and (optionally) relay messages between the AIs based on formatted clipboard commands, enabling a "group chat" between them.



---

## Features ✨

* **Multi-AI Support:** Works seamlessly with Deepseek, ChatGPT, and Gemini tabs.
* **Persistent Login:** Uses a dedicated Chrome profile to keep you logged in across sessions. No more manual logins!
* **Auto-Copy Responses:** Monitors for completed responses and automatically copies them to the clipboard, prefixed with the AI's name (e.g., `Gemini: response text`).
* **(Optional) Command Mode:** Monitors the clipboard for formatted commands (`[ Conversation till AI_NAME's last message : message_to_send ]`) and relays messages to the correct AI, creating a conversation loop.
* **Focused Workflow:** When a command is sent, the script focuses only on the target AI's tab until the response is generated and copied, minimizing unnecessary tab switching.
* **Minimal Intrusion:** Opens the browser in a narrow vertical strip on the left side of the screen to stay out of your way.
* **Clean & Safe Exit:** Guaranteed cleanup on exit (`Ctrl+C`) to close the browser and free up system RAM.

---

## Setup ⚙️

Follow these steps carefully to ensure a smooth setup.

### Step 1: Create a Virtual Environment (Highly Recommended)

Using a virtual environment (`venv`) keeps your project's dependencies isolated from your system's Python, preventing conflicts and errors.

1.  **Open your terminal or command prompt** and navigate to your project folder.
2.  **Create the virtual environment:**
    ```bash
    python3 -m venv venv
    ```
    *(On Windows, you might use `python` instead of `python3`)*
3.  **Activate the virtual environment:**
    * **On Linux (like your Xubuntu) or macOS:**
        ```bash
        source venv/bin/activate
        ```
        Your terminal prompt should now start with `(venv)`.
    * **On Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
        Your command prompt should now start with `(venv)`.

**All subsequent commands should be run inside this activated environment.**

### Step 2: Install Requirements

With your virtual environment active, install the necessary Python libraries.

```bash
pip install selenium undetected-chromedriver pyperclip
````

### Step 3: First-Time Profile Setup

The script needs a dedicated Chrome profile to store your login sessions.

1.  Run the script for the first time:
    ```bash
    python ai_controller.py
    ```
2.  An `undetected-chromedriver` window will open. **Manually log in** to Deepseek, ChatGPT, and Gemini in this specific browser window.
3.  Once logged in to all services, you can **close the browser window**. The script will have created a profile folder (e.g., `chrome-profile-uc`) in your user's home directory.

-----

## Usage 🚀

1.  **Activate Environment:** Make sure your virtual environment is active (`source venv/bin/activate` or `.\venv\Scripts\activate`).
2.  **Run the Script:** In your terminal, run:
    ```bash
    python ai_controller.py
    ```
3.  **Choose Mode:** The script will ask if you want to enable clipboard monitoring for the AI-to-AI group chat.
      * Type `y` to enable **both** Command Mode and Auto-Copy.
      * Type `n` to exit (as Command Mode is the primary function).
4.  **Operate:**
      * The controlled Chrome window will open on the left.
      * To send a command, copy text in the format `[ Conversation till AI_NAME's last message : message_to_send ]` to your clipboard.
      * The script will detect this, switch to the correct tab, send the message, and wait for the response.
      * Once the response is complete, it will be copied to your clipboard.
5.  **Stop the Script:** Go back to the terminal and press `Ctrl+C`. The script will shut down cleanly.

-----

## Troubleshooting 🚨

### Windows: Manual ChromeDriver Setup

`undetected-chromedriver` usually handles downloading the driver automatically. If it fails (due to network issues, permissions, or corporate firewalls), you might see an error. Here’s how to do it manually:

1.  **Find Your Chrome Version:**

      * Open your normal Chrome browser.
      * Go to the address bar and type `chrome://settings/help`.
      * Note down your full version number (e.g., `121.0.6167.85`). You only need the main part.

2.  **Download the Matching ChromeDriver:**

      * Go to the **Chrome for Testing availability** dashboard: `https://googlechromelabs.github.io/chrome-for-testing/`
      * Find the section matching your Chrome version (e.g., `121.0.6167.85`).
      * Under that version, find the `chromedriver` row and click the URL for `win64`.
      * This will download a `.zip` file.

3.  **Extract and Place the Driver:**

      * Unzip the downloaded file. You will find a `chromedriver.exe` file inside.
      * Copy the `chromedriver.exe` file.
      * Navigate to your project's virtual environment folder. Paste the file inside the `Scripts` folder (e.g., `C:\path\to\your\project\venv\Scripts\chromedriver.exe`).

When you run the script from the activated virtual environment, it will now automatically find and use the `chromedriver.exe` you placed there.

-----

### 🚀 Surprising Tech Fact\!

Did you know that **Git**, the version control system that powers GitHub and is used by almost every developer today, was created by **Linus Torvalds** (the creator of Linux) in just **two weeks**? In 2005, the previous system they were using became unavailable, and he needed a replacement fast to manage the massive Linux kernel codebase. He went on a short break, coded the first version of Git, and changed software development forever. It’s a powerful example of how a focused burst of creativity can solve a huge problem\!

```
```
