import time
import pyperclip
import re
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException, NoSuchWindowException, TimeoutException, StaleElementReferenceException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

# --- SELECTORS CONFIGURATION ---
# Deepseek
DEEPSEEK_STOP_SELECTOR = (By.CSS_SELECTOR, "button[data-testid='stop-button']")
DEEPSEEK_RESPONSE_TEXT_SELECTOR = (By.CSS_SELECTOR, "div.ds-markdown")
DEEPSEEK_INPUT_SELECTOR = (By.CSS_SELECTOR, "textarea[placeholder*='Message DeepSeek']")

# ChatGPT
CHATGPT_TURN_SELECTOR = (By.CSS_SELECTOR, 'article[data-turn="assistant"]')
CHATGPT_COPY_BUTTON_SELECTOR = (By.CSS_SELECTOR, "button[data-testid='copy-turn-action-button']")
CHATGPT_RESPONSE_TEXT_SELECTOR = (By.CSS_SELECTOR, ".markdown")
CHATGPT_INPUT_SELECTOR = (By.ID, "prompt-textarea")
CHATGPT_SEND_BUTTON_SELECTOR = (By.CSS_SELECTOR, "button[data-testid='send-button']")

# Gemini
GEMINI_STOP_SELECTOR = (By.CSS_SELECTOR, 'button.send-button.stop[aria-label="Stop response"]')
GEMINI_RESPONSE_SELECTOR = (By.CSS_SELECTOR, 'message-content .markdown')
GEMINI_INPUT_SELECTOR = (By.CSS_SELECTOR, 'div[role="textbox"][aria-label="Enter a prompt here"]')
GEMINI_SEND_BUTTON_SELECTOR = (By.CSS_SELECTOR, 'button[aria-label="Send message"]')

# --- Helper Function: Find and switch to the target AI's tab ---
def switch_to_ai_tab(driver, target_ai_name):
    """ Tries to find and switch to the tab of the target AI. Returns True if successful, False otherwise. """
    original_handle = None
    try:
        time.sleep(0.5) # Give browser a moment before getting handles
        original_handle = driver.current_window_handle
        for handle in driver.window_handles:
            if handle not in driver.window_handles: continue
            driver.switch_to.window(handle)
            current_url = driver.current_url.lower()
            if target_ai_name == "ChatGPT" and ("chatgpt.com" in current_url or "chat.openai.com" in current_url):
                print(f"Switched to {target_ai_name} tab.")
                return True
            elif target_ai_name == "Deepseek" and "deepseek.com" in current_url:
                print(f"Switched to {target_ai_name} tab.")
                return True
            elif target_ai_name == "Gemini" and "gemini.google.com" in current_url:
                print(f"Switched to {target_ai_name} tab.")
                return True
        if original_handle and original_handle in driver.window_handles:
             driver.switch_to.window(original_handle)
        print(f"[ERROR] {target_ai_name} ka tab nahi mila.")
        return False
    except Exception as e:
        print(f"Tab switch karte waqt error: {e}")
        try:
           if original_handle and original_handle in driver.window_handles:
                driver.switch_to.window(original_handle)
        except: pass
        return False

# --- Helper Function: Send message on the currently active tab ---
def send_message_on_current_tab(driver, target_ai_name, message):
    """ Sends message on the currently active tab """
    input_selector, send_selector, use_enter = None, None, False
    if target_ai_name == "ChatGPT":
        input_selector, send_selector = CHATGPT_INPUT_SELECTOR, CHATGPT_SEND_BUTTON_SELECTOR
    elif target_ai_name == "Deepseek":
        input_selector, use_enter = DEEPSEEK_INPUT_SELECTOR, True
    elif target_ai_name == "Gemini":
        input_selector, send_selector = GEMINI_INPUT_SELECTOR, GEMINI_SEND_BUTTON_SELECTOR
    else: return False

    try:
        if not message or message.isspace():
            print("[INFO] Clipboard message khali tha, sending skip kiya.")
            return False

        pyperclip.copy(message)
        textarea = driver.find_element(*input_selector)
        textarea.click(); time.sleep(0.1)
        textarea.send_keys(Keys.CONTROL, 'v')
        print(f"{target_ai_name} mein message paste kiya...")

        if use_enter:
            time.sleep(0.5); textarea.send_keys(Keys.ENTER); print(f"{target_ai_name} par Enter press kiya.")
        elif send_selector:
            time.sleep(0.5); wait = WebDriverWait(driver, 10)
            send_button = wait.until(EC.element_to_be_clickable(send_selector))
            send_button.click(); print(f"{target_ai_name} send button click kiya.")
        return True
    except Exception as e:
        print(f"{target_ai_name} par message bhejte waqt error: {e}")
        return False

# --- Helper Function: Wait for response and copy ---
def wait_and_copy_response(driver, ai_name, last_copied_dict, potential_dict):
    """ Waits for the AI on the current tab to respond and copies it """
    print(f"{ai_name} ke response ka intezaar hai...")
    copied, start_time, timeout_seconds = False, time.time(), 300
    while time.time() - start_time < timeout_seconds:
        try:
            is_generating, is_complete_flag = False, False
            if ai_name == "Deepseek":
                try:
                    if driver.find_element(*DEEPSEEK_STOP_SELECTOR).is_displayed(): is_generating = True
                except: is_generating = False
            elif ai_name == "ChatGPT":
                try:
                    turns = driver.find_elements(*CHATGPT_TURN_SELECTOR)
                    if turns and turns[-1].find_element(*CHATGPT_COPY_BUTTON_SELECTOR).is_displayed(): is_complete_flag = True
                except: pass
            elif ai_name == "Gemini":
                 try:
                    if driver.find_element(*GEMINI_STOP_SELECTOR).is_displayed(): is_generating = True
                 except: is_generating = False

            if is_generating:
                if ai_name in potential_dict: potential_dict[ai_name] = None
                time.sleep(1); continue
            else:
                current_text, copy_now = "", False
                if ai_name == "Deepseek" or ai_name == "Gemini":
                    selector = DEEPSEEK_RESPONSE_TEXT_SELECTOR if ai_name == "Deepseek" else GEMINI_RESPONSE_SELECTOR
                    responses = driver.find_elements(*selector)
                    if not responses: time.sleep(1); continue
                    current_text = responses[-1].text
                    potential = potential_dict.get(ai_name)
                    if potential is not None and current_text == potential: copy_now = True
                    elif current_text: potential_dict[ai_name] = current_text; time.sleep(1); continue
                    else: time.sleep(1); continue
                elif ai_name == "ChatGPT":
                    if is_complete_flag:
                        turns = driver.find_elements(*CHATGPT_TURN_SELECTOR)
                        if turns: current_text = turns[-1].find_element(*CHATGPT_RESPONSE_TEXT_SELECTOR).text; copy_now = True
                    else: time.sleep(1); continue

                if copy_now and current_text and current_text != last_copied_dict[ai_name]:
                    final_text = f"{ai_name}: {current_text}"
                    pyperclip.copy(final_text); last_copied_dict[ai_name] = current_text
                    if ai_name in potential_dict: potential_dict[ai_name] = None
                    print(f"\n✅ Naya {ai_name} response detect hua! Copying..."); print("Success! Clipboard par copy ho gaya.")
                    copied = True; break
                elif copy_now:
                     if ai_name in potential_dict: potential_dict[ai_name] = None
                     copied = True; break
        except (StaleElementReferenceException, NoSuchWindowException) as e:
            print(f"Window/Element error during wait: {e}"); break
        except Exception as e:
            time.sleep(1); continue
    if not copied: print(f"[TIMEOUT] {ai_name} se response {timeout_seconds} seconds mein nahi mila.")
    return copied

# --- Main script ---
print("--- Auto-Copy & Command Smart Scraper (Focused Monitoring) ---")
print("Band karne ke liye terminal mein Ctrl+C dabayein.")

chrome_options = uc.ChromeOptions()
profile_path = os.path.join(os.path.expanduser('~'), 'chrome-profile-uc')
chrome_options.add_argument(f"--user-data-dir={profile_path}")

try:
    driver = uc.Chrome(options=chrome_options)
    print("Successfully started! Aap pehle se logged in hone chahiye.")
    driver.set_window_size(273, 768); driver.set_window_position(0, 0)
    print(f"Browser window ko set kar diya gaya hai.")
except Exception as e:
    print(f"\n[ERROR] Chrome shuru nahi ho paya: {e}"); exit()

monitor_clipboard = input("Kya aap AI-to-AI group chat ke liye clipboard monitoring shuru karna chahte hain? (y/n): ")
if monitor_clipboard.lower() == 'y':
    print("\n✅ OK! Clipboard monitoring chalu hai.")
    clipboard_regex = re.compile(r"\[ Conversation till (Deepseek|ChatGPT|Gemini)'s last message : (.*) \]", re.DOTALL)
    last_processed_clipboard = pyperclip.paste()
else:
    print("\nOK! Script band kar di jayegi."); driver.quit(); exit()

last_copied_message = { "ChatGPT": "", "Deepseek": "", "Gemini": "" }
potential_message = { "Deepseek": None, "Gemini": None }

try:
    while True:
        current_clipboard = pyperclip.paste()
        if current_clipboard != last_processed_clipboard:
            match = clipboard_regex.search(current_clipboard)
            if match:
                print(f"\n🤖 Naya Group Chat command clipboard par detect hua!")
                target_ai = match.group(1)
                message_to_send = match.group(2).strip()
                print(f"(Command indicates message should be sent TO {target_ai})")
                if switch_to_ai_tab(driver, target_ai):
                    if send_message_on_current_tab(driver, target_ai, message_to_send):
                        last_processed_clipboard = message_to_send if message_to_send else current_clipboard
                        print(f"Message safalta se {target_ai} ko bhej diya gaya.")
                        if wait_and_copy_response(driver, target_ai, last_copied_message, potential_message):
                            last_processed_clipboard = pyperclip.paste()
                        else:
                            print(f"[ERROR] {target_ai} se response copy nahi ho paya.")
                            last_processed_clipboard = current_clipboard
                    else:
                        print(f"[ERROR] {target_ai} ko message nahi bhej paya.")
                        last_processed_clipboard = current_clipboard
                else:
                    print(f"[ERROR] {target_ai} ka tab nahi mila.")
                    last_processed_clipboard = current_clipboard
        time.sleep(2)
except KeyboardInterrupt:
    print("\nScript ko band kiya ja raha hai...")
finally:
    if 'driver' in locals() and driver:
        driver.quit()
    print("Browser band kar diya. Goodbye!")
